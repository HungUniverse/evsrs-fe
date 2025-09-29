import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RevenueChart() {
  // Mock data for revenue chart
  const monthlyRevenue = [
    { month: "Tháng 1", revenue: 12000000, bookings: 156 },
    { month: "Tháng 2", revenue: 14500000, bookings: 189 },
    { month: "Tháng 3", revenue: 13200000, bookings: 167 },
    { month: "Tháng 4", revenue: 16800000, bookings: 201 },
    { month: "Tháng 5", revenue: 18500000, bookings: 234 },
    { month: "Tháng 6", revenue: 17200000, bookings: 198 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const maxRevenue = Math.max(...monthlyRevenue.map(r => r.revenue));
  const maxBookings = Math.max(...monthlyRevenue.map(r => r.bookings));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthlyRevenue.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{data.month}</span>
                <span className="font-medium">{formatCurrency(data.revenue)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(data.revenue / maxRevenue) * 100}%`,
                    backgroundColor: '#00D166'
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{data.bookings} đơn đặt</span>
                <span>Trung bình: {formatCurrency(data.revenue / data.bookings)}/đơn</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
