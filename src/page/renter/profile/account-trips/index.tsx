// src/pages/account/account-trips.tsx
import { useMemo, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import TripFilter, { type TripFilterValue } from "./components/trip-filter";
import ShowMyTrip from "./components/show-my-trip";
import type { Contract } from "@/@types/contract";
import { mockContracts } from "@/mockdata/mock-contract";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

export default function AccountTrips() {
  const user = useAuthStore((s) => s.user); // { id: string, ... }
  const navigate = useNavigate();
  const location = useLocation();

  const allContracts = useMemo<Contract[]>(
    () => mockContracts as Contract[],
    []
  );

  // Chỉ giữ hợp đồng của user theo lessorId
  const myContracts = useMemo<Contract[]>(() => {
    if (!user?.id) return [];
    return allContracts.filter(
      (c) => c.lessorId === user.id
    );
  }, [allContracts, user?.id]);

  // State bộ lọc UI
  const [filter, setFilter] = useState<TripFilterValue>({
    orderId: "",
    carModel: "",
    status: "all",
    dateStart: undefined,
    dateEnd: undefined,
  });

  // Áp bộ lọc UI lên danh sách của user
  const filtered = useMemo<Contract[]>(() => {
    const start = filter.dateStart ? new Date(filter.dateStart) : undefined;
    const end = filter.dateEnd
      ? new Date(filter.dateEnd + "T23:59:59")
      : undefined;

    return myContracts.filter((c) => {
      if (
        filter.orderId &&
        !c.orderId.toLowerCase().includes(filter.orderId.toLowerCase())
      )
        return false;

      if (filter.carModel) {
        const needle = filter.carModel.toLowerCase();
        const hay = `${c.vehicleCode} ${c.title}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      if (filter.status !== "all" && c.status !== filter.status) return false;

      const st = new Date(c.rentalStartDate);
      const en = new Date(c.rentalEndDate);
      if (start && en < start) return false;
      if (end && st > end) return false;

      return true;
    });
  }, [myContracts, filter]);

  // Guard đăng nhập đặt ngoài useMemo (tránh union kiểu)
  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-slate-600">
          Vui lòng đăng nhập để xem chuyến của bạn.
        </p>
      </div>
    );
  }

  // Check if we're on a detail page
  const isDetailPage = location.pathname !== "/account/my-trip";

  return (
    <div className="space-y-4">
      {!isDetailPage && (
        <>
          <TripFilter
            value={filter}
            onChange={(p) => setFilter((prev) => ({ ...prev, ...p }))}
          />
          <ShowMyTrip
            data={filtered} // ✅ luôn là Contract[]
            onClickCode={(orderId) => navigate(`/account/my-trip/${orderId}`)}
          />
        </>
      )}
      <Outlet />
    </div>
  );
}
