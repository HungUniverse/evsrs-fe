import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV } from "@/@types/car/carEv";
import { Car, CheckCircle, AlertCircle, Wrench, Clock } from "lucide-react";

interface CarStats {
  total: number;
  available: number;
  inUse: number;
  reserved: number;
  repairing: number;
}

export default function CarStats() {
  const [stats, setStats] = useState<CarStats>({
    total: 0,
    available: 0,
    inUse: 0,
    reserved: 0,
    repairing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await carEVAPI.getAll({ pageNumber: 1, pageSize: 9999 });
        
        if (response.data?.items) {
          const cars = response.data.items as CarEV[];
          
          setStats({
            total: cars.length,
            available: cars.filter((car) => car.status === "AVAILABLE").length,
            inUse: cars.filter((car) => car.status === "IN_USE").length,
            reserved: cars.filter((car) => car.status === "RESERVED").length,
            repairing: cars.filter((car) => car.status === "REPAIRING").length,
          });
        }
      } catch (err) {
        console.error("Error fetching car stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Tổng số xe",
      value: stats.total,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Có sẵn",
      value: stats.available,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Đang sử dụng",
      value: stats.inUse,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đã đặt",
      value: stats.reserved,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Đang sửa",
      value: stats.repairing,
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

