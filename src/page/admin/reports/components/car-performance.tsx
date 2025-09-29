import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCars } from "@/mockdata/mock-car";

export function CarPerformance() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Sort cars by performance (trips * rating)
  const topPerformingCars = [...mockCars]
    .sort((a, b) => (b.trips * b.rating) - (a.trips * a.rating))
    .slice(0, 5);

  const getPerformanceColor = (trips: number) => {
    if (trips >= 200) return 'bg-green-100 text-green-800';
    if (trips >= 150) return 'bg-blue-100 text-blue-800';
    if (trips >= 100) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPerformanceText = (trips: number) => {
    if (trips >= 200) return 'Xuất sắc';
    if (trips >= 150) return 'Tốt';
    if (trips >= 100) return 'Trung bình';
    return 'Cần cải thiện';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xe có hiệu suất cao nhất</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformingCars.map((car, index) => (
            <div key={car.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
              </div>
              <img 
                src={car.image} 
                alt={car.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium">{car.name}</h4>
                <p className="text-sm text-muted-foreground">{car.model}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs">⭐ {car.rating}</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs">{car.trips} chuyến</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getPerformanceColor(car.trips)}>
                  {getPerformanceText(car.trips)}
                </Badge>
                <p className="text-sm font-medium mt-1">{formatCurrency(car.pricePerDay)}</p>
                <p className="text-xs text-muted-foreground">/ngày</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
