import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCustomers } from "@/mockdata/mock-admin";

export function CustomerList() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'banned':
        return 'Bị khóa';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách khách hàng</CardTitle>
          <Button>Thêm khách hàng</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img 
                src={customer.avatar} 
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{customer.name}</h4>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
                <p className="text-xs text-muted-foreground">
                  Tham gia: {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="text-center">
                <p className="font-medium">{customer.totalBookings}</p>
                <p className="text-xs text-muted-foreground">đơn đặt</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                <p className="text-xs text-muted-foreground">đã chi tiêu</p>
              </div>
              <div className="text-center">
                <Badge className={getStatusColor(customer.status)}>
                  {getStatusText(customer.status)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Đặt gần nhất: {new Date(customer.lastBooking).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Xem</Button>
                <Button variant="outline" size="sm">Sửa</Button>
                <Button variant="outline" size="sm">Khóa</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
