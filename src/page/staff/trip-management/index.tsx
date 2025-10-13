import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { TripFilterValue } from "./components/trip-filter";
import StaffTripFilter from "./components/trip-filter";
import ShowTrip from "./components/show-trip";
import UserInfoModal from "./components/user-info-modal";

export default function TripManagement() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(
    "[StaffTripManagement] Component render - bookings:",
    bookings.length,
    "loading:",
    loading,
    "error:",
    error
  );

  const [filter, setFilter] = useState<TripFilterValue>({
    orderId: "",
    carModel: "",
    status: "all",
    dateStart: undefined,
    dateEnd: undefined,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderBookingAPI.getAll({
          pageNumber: 1,
          pageSize: 100,
        });

        setBookings(res.data.data?.items || []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message || "Không tải được danh sách đơn hàng");
      } finally {
        setLoading(false);
        console.log("[StaffTripManagement] Loading finished");
      }
    };

    loadBookings();
  }, []);

  // Filter orders
  const filteredBookings = useMemo(() => {
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
      // Filter by order ID
      if (
        filter.orderId &&
        !booking.id.toLowerCase().includes(filter.orderId.toLowerCase())
      ) {
        console.log(
          "[StaffTripManagement] Filtered out by order ID:",
          booking.id
        );
        return false;
      }

      // Filter by car model
      if (filter.carModel) {
        const needle = filter.carModel.toLowerCase();
        const modelName = booking.carEvs?.model?.modelName || "";
        if (!modelName.toLowerCase().includes(needle)) {
          console.log(
            "[StaffTripManagement] Filtered out by car model:",
            modelName
          );
          return false;
        }
      }

      // Filter by status
      if (filter.status !== "all" && booking.status !== filter.status) {
        console.log(
          "[StaffTripManagement] Filtered out by status:",
          booking.status
        );
        return false;
      }

      // Filter by date range
      const bookingStart = new Date(booking.startAt);
      const bookingEnd = new Date(booking.endAt);
      if (start && bookingEnd < start) {
        console.log(
          "[StaffTripManagement] Filtered out by start date:",
          booking.startAt
        );
        return false;
      }
      if (end && bookingStart > end) {
        console.log(
          "[StaffTripManagement] Filtered out by end date:",
          booking.endAt
        );
        return false;
      }

      return true;
    });

    console.log(
      "[StaffTripManagement] Filtered result:",
      filtered.length,
      "items"
    );
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
