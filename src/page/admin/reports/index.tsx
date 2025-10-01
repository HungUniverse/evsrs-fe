import { BookingStats } from "./components/booking-stats";
import { RevenueChart } from "./components/revenue-chart";
import { CarPerformance } from "./components/car-performance";
import { LocationPerformance } from "./components/location-performance";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Phân tích</h1>
        <p className="text-muted-foreground">
          Phân tích hiệu suất và doanh thu của hệ thống
        </p>
      </div>
      
      <BookingStats />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <CarPerformance />
      </div>
      
      <LocationPerformance />
    </div>
  );
}
