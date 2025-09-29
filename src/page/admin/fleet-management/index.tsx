import { FleetStats } from "./components/fleet-stats";
import { CarList } from "./components/car-list";
import { LocationList } from "./components/location-list";

export default function FleetManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đội xe & điểm thuê</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin xe và các điểm thuê trong hệ thống
        </p>
      </div>
      
      <FleetStats />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <CarList />
        <LocationList />
      </div>
    </div>
  );
}
