import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TripFilterValue } from "./components/trip-filter";
import type { Contract } from "@/@types/contract";
import { mockContracts } from "@/mockdata/mock-contract";
import StaffTripFilter from "./components/trip-filter";
import ShowTrip from "./components/show-trip";
import UserInfoModal from "./components/user-info-modal";

export default function TripManagement() {
  const navigate = useNavigate();
  const data: Contract[] = useMemo(() => mockContracts as Contract[], []);

  const [filter, setFilter] = useState<TripFilterValue>({
    orderId: "",
    carModel: "",
    status: "all",
    dateStart: undefined,
    dateEnd: undefined,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const start = filter.dateStart ? new Date(filter.dateStart) : null;
    const end = filter.dateEnd ? new Date(filter.dateEnd + "T23:59:59") : null;

    return data.filter((c) => {
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
  }, [data, filter]);

  return (
    <div className="space-y-4">
      <StaffTripFilter
        value={filter}
        onChange={(p) => setFilter((prev) => ({ ...prev, ...p }))}
      />
      <ShowTrip
        data={filtered}
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
