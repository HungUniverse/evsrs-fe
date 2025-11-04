import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { UserFullAPI } from "@/apis/user.api";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { TripFilterValue } from "./components/trip-filter";
import StaffTripFilter from "./components/trip-filter";
import ShowTrip from "./components/show-trip";
import UserInfoModal from "./components/user-info-modal";
import { Button } from "@/components/ui/button";

export default function TripManagement() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [bookings, setBookings] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffDepotId, setStaffDepotId] = useState<string | null>(null);

  const [filter, setFilter] = useState<TripFilterValue>({
    orderId: "",
    carModel: "",
    status: "all",
    dateStart: undefined,
    dateEnd: undefined,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const getStaffDepot = async () => {
      if (!user?.userId) return;

      try {
        const userInfo = await UserFullAPI.getDepotByUserId(user.userId);
        setStaffDepotId(userInfo.depotId || null);
      } catch (err) {
        console.error(err);
        setError("Không lấy được thông tin chi nhánh của nhân viên");
      }
    };

    getStaffDepot();
  }, [user?.userId]);

  useEffect(() => {
    const loadBookings = async () => {
      if (!staffDepotId) return;

      setLoading(true);
      setError(null);
      try {
        const res = await orderBookingAPI.getByDepotId(staffDepotId);
        const items = res.data.data;
        // Check if items is an array directly or inside a pagination object
        const bookingsList = Array.isArray(items) ? items : items?.items || [];
        setBookings(bookingsList);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message || "Không tải được danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [staffDepotId]);

  const filteredBookings = useMemo(() => {
    if (!Array.isArray(bookings)) {
      return [];
    }

    console.log(
      "[StaffTripManagement] Filtering bookings. Total bookings:",
      bookings.length
    );
    console.log("[StaffTripManagement] Filter:", filter);

    if (!bookings.length) {
      console.log("[StaffTripManagement] No bookings to filter");
      return [];
    }

    const start = filter.dateStart ? new Date(filter.dateStart) : null;
    const end = filter.dateEnd ? new Date(filter.dateEnd + "T23:59:59") : null;

    const filtered = bookings.filter((booking) => {
      if (!booking) return false;

      // Filter by order ID
      if (
        filter.orderId &&
        !booking.id?.toLowerCase().includes(filter.orderId.toLowerCase())
      ) {
        return false;
      }

      // Filter by car model
      if (filter.carModel) {
        const needle = filter.carModel.toLowerCase();
        const modelName = booking.carEvs?.model?.modelName || "";
        if (!modelName.toLowerCase().includes(needle)) {
          return false;
        }
      }

      // Filter by status
      if (filter.status !== "all" && booking.status !== filter.status) {
        return false;
      }

      // Filter by date range
      const bookingStart = new Date(booking.startAt);
      const bookingEnd = new Date(booking.endAt);
      if (start && bookingEnd < start) {
        return false;
      }
      if (end && bookingStart > end) {
        return false;
      }

      return true;
    });

    return filtered;
  }, [bookings, filter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <StaffTripFilter
          value={filter}
          onChange={(p) => setFilter((prev) => ({ ...prev, ...p }))}
        />
        <div className="rounded-xl border bg-white p-6 text-slate-600">
          Đang tải dữ liệu…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <StaffTripFilter
          value={filter}
          onChange={(p) => setFilter((prev) => ({ ...prev, ...p }))}
        />
        <div className="rounded-xl border bg-white p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StaffTripFilter
        value={filter}
        onChange={(p) => setFilter((prev) => ({ ...prev, ...p }))}
      />
      <Button
        className="bg-blue-500 text-white hover:bg-blue-400"
        onClick={() => navigate("/staff/create-user-at-depot")}
      >
        Đặt xe tại trạm
      </Button>

      <ShowTrip
        data={filteredBookings}
        onClickCode={(orderId) => navigate(`/staff/trip/${orderId}`)}
        onClickUser={(userId) => setSelectedUserId(userId)}
      />

      <UserInfoModal
        open={!!selectedUserId}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
        userId={selectedUserId}
      />
    </div>
  );
}
