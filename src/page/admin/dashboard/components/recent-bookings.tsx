import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRecentBookings } from "@/mockdata/mock-admin";

export function RecentBookings() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'ongoing':
        return 'Đang sử dụng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn đặt gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRecentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#E8F5E8'}}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    style={{color: '#00D166'}}
                    className="h-5 w-5"
                  >
                    <path d="M8 17h8M8 17a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4M8 17v-4h8v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{booking.customerName}</p>
                  <p className="text-xs text-muted-foreground">{booking.carName}</p>
                  <p className="text-xs text-muted-foreground">{booking.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</p>
                <Badge className={getStatusColor(booking.status)}>
                  {getStatusText(booking.status)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {booking.startDate} - {booking.endDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
