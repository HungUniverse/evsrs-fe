import { OverviewCards } from "./components/overview-cards";
import { RecentBookings } from "./components/recent-bookings";
import { LocationOverview } from "./components/location-overview";

export default function DashBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan hệ thống quản lý thuê xe
        </p>
      </div>

      <OverviewCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentBookings />
        </div>
        <div>
          <LocationOverview />
        </div>
      </div>
    </div>
  );
}
