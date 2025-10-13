import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import type { TripFilterValue } from "./components/trip-filter";
import type { OrderBookingStatus } from "@/@types/enum";
import { toDateOnlyISO, toLocalDateOnly } from "@/hooks/fmt-date-time";
import { useModelNames } from "@/hooks/use-model-name";
import TripFilter from "./components/trip-filter";
import ShowMyTrip from "./components/show-my-trip";

export default function SearchOrderBooking() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  // Store chỉ có userId
  const uid = user?.userId as string | undefined;

  const [filter, setFilter] = useState<TripFilterValue>({
    orderId: "",
    carModel: "",
    status: "all",
    dateStart: undefined,
    dateEnd: undefined,
  });

  const [bookings, setBookings] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  // Debug logs
  useEffect(() => {
    console.log("[SearchOrderBooking] user:", user);
    console.log("[SearchOrderBooking] uid:", uid);
  }, [user, uid]);

  // Params gửi API (server-side filter — dùng được tới đâu hay tới đó)
  const params = useMemo(() => {
    const search = `${filter.orderId} ${filter.carModel}`.trim() || undefined;
    const status =
      filter.status !== "all"
        ? (filter.status as OrderBookingStatus)
        : undefined;
    const from = toDateOnlyISO(filter.dateStart);
    const to = toDateOnlyISO(filter.dateEnd);

    const p = {
      pageNumber: 1,
      pageSize: 20,
      userId: uid,
      status,
      from,
      to,
      search,
    };
    console.log("[SearchOrderBooking] params:", p);
    return p;
  }, [filter, uid]);

  // Fetch danh sách booking theo userId + params
  useEffect(() => {
    if (!uid) {
      setBookings([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await orderBookingAPI.getAll(params);
        const payload = res.data?.data;
        // Hỗ trợ cả 2 shape: pagination (items) hoặc mảng thẳng
        const items: OrderBookingDetail[] = Array.isArray(payload)
          ? payload
          : (payload?.items ?? []);
        if (!cancelled) setBookings(items);
      } catch (err) {
        console.error("[SearchOrderBooking] API error:", err);
        if (!cancelled) {
          setError("Không tải được dữ liệu. Vui lòng thử lại.");
          setBookings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, uid]);

  const modelIds = useMemo(() => {
    const s = new Set<string>();
    for (const ob of bookings) {
      const id = getModelId(ob);
      if (id) s.add(id);
    }
    return Array.from(s);
  }, [bookings]);

  const { names: modelNameMap } = useModelNames(modelIds);

  const filteredBookings = useMemo(() => {
    const fromStr = filter.dateStart || undefined;
    const toStr = filter.dateEnd || undefined;

    const needleId = filter.orderId.trim().toLowerCase();
    const needleModel = filter.carModel.trim().toLowerCase();
    const wantStatus =
      filter.status !== "all"
        ? (filter.status as OrderBookingStatus)
        : undefined;

    return bookings.filter((ob) => {
      if (needleId && !ob.id?.toLowerCase().includes(needleId)) return false;

      if (needleModel) {
        const modelId = getModelId(ob);
        const displayName = (modelId ? modelNameMap[modelId] : "") ?? "";
        if (!displayName.toLowerCase().includes(needleModel)) return false;
      }

      if (wantStatus && ob.status !== wantStatus) return false;

      if (fromStr || toStr) {
        const stDay = toLocalDateOnly(ob.startAt);
        if (fromStr && stDay < fromStr) return false;
        if (toStr && stDay > toStr) return false; // bắt đầu sau ngày kết thúc
      }

      return true;
    });
  }, [bookings, filter, modelNameMap]);

  function getModelId(ob: OrderBookingDetail): string | undefined {
    return ob?.carEvs?.modelId ?? ob?.carEvs?.model?.id ?? undefined;
  }

  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-slate-600">
          Vui lòng đăng nhập để xem đơn đặt xe của bạn.
        </p>
      </div>
    );
  }

  const isDetailPage = location.pathname !== "/account/my-trip";
  console.log("[AccountTrips] location.pathname:", location.pathname);
  console.log("[AccountTrips] isDetailPage:", isDetailPage);

  return (
    <div className="space-y-4">
      {!isDetailPage && (
        <>
          <TripFilter
            value={filter}
            onChange={(p) => setFilter((prev) => ({ ...prev, ...p }))}
          />

          {loading ? (
            <div className="rounded-xl border bg-white p-6 text-slate-600">
              Đang tải dữ liệu…
            </div>
          ) : error ? (
            <div className="rounded-xl border bg-white p-6 text-rose-600">
              {error}
            </div>
          ) : (
            <ShowMyTrip
              data={filteredBookings}
              onClickCode={(orderId) => navigate(`/account/my-trip/${orderId}`)}
            />
          )}
        </>
      )}
      <Outlet />
      {console.log("[AccountTrips] Rendering Outlet")}
    </div>
  );
}
