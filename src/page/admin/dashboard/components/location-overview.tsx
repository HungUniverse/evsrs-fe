import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRentalLocations } from "@/mockdata/mock-admin";

export function LocationOverview() {
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trung tâm thuê xe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockRentalLocations.map((location) => (
            <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
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
                <div>
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                  <p className="text-sm text-muted-foreground">Quản lý: {location.manager}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(location.status)}>
                  {getStatusText(location.status)}
                </Badge>
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">
                    {location.availableCars}/{location.totalCars} xe có sẵn
                  </p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(location.availableCars / location.totalCars) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
