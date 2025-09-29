import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRentalLocations } from "@/mockdata/mock-admin";
import { mockCars } from "@/mockdata/mock-car";

export function LocationPerformance() {
  const getLocationPerformance = () => {
    return mockRentalLocations.map(location => {
      // Count cars in this location
      const carsInLocation = mockCars.filter(car => car.province === location.city);
      const totalRevenue = carsInLocation.reduce((sum, car) => sum + (car.pricePerDay * car.trips), 0);
      const utilizationRate = (location.totalCars - location.availableCars) / location.totalCars;

      return {
        ...location,
        totalRevenue,
        utilizationRate: utilizationRate * 100,
        carsInLocation: carsInLocation.length,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 text-green-800';
    if (rate >= 60) return 'bg-blue-100 text-blue-800';
    if (rate >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getUtilizationText = (rate: number) => {
    if (rate >= 80) return 'Cao';
    if (rate >= 60) return 'Trung bình';
    if (rate >= 40) return 'Thấp';
    return 'Rất thấp';
  };

  const locationPerformance = getLocationPerformance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiệu suất theo địa điểm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationPerformance.map((location, index) => (
            <div key={location.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">#{index + 1}</span>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6 text-blue-600"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{location.name}</h4>
                <p className="text-sm text-muted-foreground">{location.city}</p>
                <p className="text-sm text-muted-foreground">Quản lý: {location.manager}</p>
              </div>
              <div className="text-center">
                <Badge className={getUtilizationColor(location.utilizationRate)}>
                  {Math.round(location.utilizationRate)}% {getUtilizationText(location.utilizationRate)}
                </Badge>
                <p className="text-sm font-medium mt-1">{formatCurrency(location.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{location.carsInLocation}</p>
                <p className="text-xs text-muted-foreground">xe</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {location.availableCars}/{location.totalCars} có sẵn
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
