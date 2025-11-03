import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { carEVAPI } from "@/apis/car-ev.api";
import { UserFullAPI } from "@/apis/user.api";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { CarEV } from "@/@types/car/carEv";
import {
  Car,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Battery,
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  activeOrders: number;
  completedOrders: number;
  pendingOrders: number;
  returnedOrders: number;
  totalCars: number;
  availableCars: number;
  inUseCars: number;
  reservedCars: number;
}

export default function StaffDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    todayOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    returnedOrders: 0,
    totalCars: 0,
    availableCars: 0,
    inUseCars: 0,
    reservedCars: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get staff's full user info to get depot ID
        if (!user?.userId) {
          console.warn("[StaffDashboard] No user ID found");
          setLoading(false);
          return;
        }

        const userFull = await UserFullAPI.getById(user.userId);
        const staffDepotId = userFull.depotId;

        if (!staffDepotId) {
          console.warn("[StaffDashboard] No depot ID found for staff");
          setLoading(false);
          return;
        }

        // Fetch orders data filtered by depot
        const today = new Date().toISOString().split("T")[0];
        const allOrdersResponse =
          await orderBookingAPI.getByDepotId(staffDepotId);

        // Handle both response formats: array or paginated
        const orders = Array.isArray(allOrdersResponse.data.data)
          ? allOrdersResponse.data.data
          : allOrdersResponse.data.data?.items || [];

        // Filter today's orders from all orders
        const todayOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt)
            .toISOString()
            .split("T")[0];
          return orderDate === today;
        });

        // Calculate order statistics
        const activeOrders = orders.filter((o) =>
          ["CONFIRMED", "READY_FOR_CHECKOUT", "CHECKED_OUT", "IN_USE"].includes(
            o.status
          )
        ).length;

        const completedOrders = orders.filter(
          (o) => o.status === "COMPLETED"
        ).length;
        const pendingOrders = orders.filter(
          (o) => o.status === "PENDING"
        ).length;
        const returnedOrders = orders.filter(
          (o) => o.status === "RETURNED"
        ).length;

        // Get cars data for the depot
        const carsResponse = await carEVAPI.getCarByDepotId(staffDepotId);

        const cars = carsResponse.items || [];

        const carsInUse = orders.filter((o) =>
          ["CHECKED_OUT", "IN_USE"].includes(o.status)
        ).length;

        const availableCars = cars.filter(
          (car: CarEV) => car.status === "AVAILABLE"
        ).length;
        const reservedCars = cars.filter(
          (car: CarEV) => car.status === "RESERVED"
        ).length;

        setStats({
          totalOrders: orders.length,
          todayOrders: todayOrders.length,
          activeOrders,
          completedOrders,
          pendingOrders,
          returnedOrders,
          totalCars: cars.length,
          availableCars: availableCars,
          inUseCars: carsInUse,
          reservedCars,
        });
      } catch (error) {
        console.error("[StaffDashboard] Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const orderCards = [
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đơn hôm nay",
      value: stats.todayOrders,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Đang hoạt động",
      value: stats.activeOrders,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Chờ xử lý",
      value: stats.pendingOrders,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Hoàn thành",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Đã trả xe",
      value: stats.returnedOrders,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const carCards = [
    {
      title: "Tổng xe trong trạm",
      value: stats.totalCars,
      icon: Car,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Xe khả dụng",
      value: stats.availableCars,
      icon: Battery,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Xe đang cho thuê",
      value: stats.inUseCars,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Xe đã đặt trước",
      value: stats.reservedCars,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Xin chào, {user?.name || "Staff"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Tổng quan hoạt động trạm của bạn hôm nay
        </p>
      </div>

      {/* Order Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📋 Thống kê đơn hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {orderCards.map((card) => (
            <Card
              key={card.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Car Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🚗 Thống kê xe điện
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {carCards.map((card) => (
            <Card
              key={card.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {card.title === "Xe khả dụng" &&
                    `${Math.round((stats.availableCars / stats.totalCars) * 100)}% tổng xe`}
                  {card.title === "Xe đang cho thuê" &&
                    `${Math.round((stats.inUseCars / stats.totalCars) * 100)}% tổng xe`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
