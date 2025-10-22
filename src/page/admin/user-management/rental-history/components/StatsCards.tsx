import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Clock, Calendar } from "lucide-react";

interface RentalItem {
  id: string;
  totalAmount: number;
  status: "completed" | "ongoing" | "cancelled" | "confirmed" | string;
}

interface StatsCardsProps {
  rentals: RentalItem[];
}

export default function StatsCards({ rentals }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng lượt thuê</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{rentals.length}</div>
          <p className="text-xs text-muted-foreground">
            {rentals.filter(r => r.status === 'completed').length} đã hoàn thành
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đang thuê</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>
            {rentals.filter(r => r.status === 'ongoing').length}
          </div>
          <p className="text-xs text-muted-foreground">Xe đang được thuê</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>
            {rentals.filter(r => r.status === 'confirmed').length}
          </div>
          <p className="text-xs text-muted-foreground">Chờ nhận xe</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">₫</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>
            {formatCurrency(rentals.reduce((sum, r) => sum + (r.totalAmount || 0), 0))}
          </div>
          <p className="text-xs text-muted-foreground">Từ các giao dịch hoàn thành</p>
        </CardContent>
      </Card>
    </div>
  );
}


