import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

interface RentalItem {
  id: string;
  customerName: string;
  customerId: string;
  carName: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalAmount: number;
  status: "completed" | "ongoing" | "cancelled" | "confirmed" | string;
  pickupLocation: string;
}

interface RentalHistoryTableProps {
  rentals: RentalItem[];
}

const statusColors = {
  completed: "bg-green-100 text-green-800",
  ongoing: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  confirmed: "bg-yellow-100 text-yellow-800",
};

const statusLabels = {
  completed: "Hoàn thành",
  ongoing: "Đang thuê",
  cancelled: "Đã hủy",
  confirmed: "Đã xác nhận",
};

export default function RentalHistoryTable({ rentals }: RentalHistoryTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử thuê xe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã thuê</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Xe thuê</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rental.customerName}</div>
                      <div className="text-sm text-muted-foreground">{rental.customerId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rental.carName}</div>
                      <div className="text-sm text-muted-foreground">{rental.licensePlate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                      </div>
                      <div className="text-sm text-muted-foreground">{rental.duration} ngày</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {rental.pickupLocation}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(rental.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={(statusColors as any)[rental.status] || ""}>
                      {(statusLabels as any)[rental.status] || rental.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Chi tiết
                      </Button>
                      {rental.status === 'ongoing' && (
                        <Button size="sm" variant="destructive">
                          Hủy
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


