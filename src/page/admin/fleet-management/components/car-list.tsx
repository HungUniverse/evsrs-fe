import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCars } from "@/mockdata/mock-car";
import { mockRentalLocations } from "@/mockdata/mock-admin";

export function CarList() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getLocationName = (province: string) => {
    const location = mockRentalLocations.find(loc => loc.city === province);
    return location ? location.name : province;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách xe</CardTitle>
          <Button>Thêm xe mới</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCars.slice(0, 10).map((car) => (
            <div key={car.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img 
                src={car.image} 
                alt={car.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{car.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {car.model} • {car.seats} chỗ ngồi
                </p>
                <p className="text-sm text-muted-foreground">
                  {getLocationName(car.province)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(car.pricePerDay)}/ngày</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={car.freeDeposit ? "default" : "secondary"}>
                    {car.freeDeposit ? "Miễn cọc" : "Có cọc"}
                  </Badge>
                  {car.discount > 0 && (
                    <Badge variant="destructive">-{car.discount}%</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {car.trips} chuyến • ⭐ {car.rating}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Sửa</Button>
                <Button variant="outline" size="sm">Xóa</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
