import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Wrench,
  XCircle,
  CalendarClock,
  LandPlot,
  Car,
} from "lucide-react";

interface StatCardProps {
  totalCars: number;
  availableCars: number;
  inUseCars: number;
  reservedCars: number;
  fixingCars: number;
  unavailableCars: number;
}

function CarStats({
  totalCars,
  availableCars,
  inUseCars,
  reservedCars,
  fixingCars,
  unavailableCars,
}: StatCardProps) {
  const stats = [
    {
      label: "Tổng số xe",
      value: totalCars,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Sẵn sàng",
      value: availableCars,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Đang sử dụng",
      value: inUseCars,
      icon: LandPlot,
      color: "text-orange-400",
      bgColor: "bg-orange-50",
    },
    {
      label: "Đã đặt trước",
      value: reservedCars,
      icon: CalendarClock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Đang sửa chữa",
      value: fixingCars,
      icon: Wrench,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Không khả dụng",
      value: unavailableCars,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default CarStats;
