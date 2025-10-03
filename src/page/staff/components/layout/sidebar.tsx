import React from "react";
import { Car, ShoppingCart, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const StaffSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: Car,
      path: "/staff/dashboard",
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
      path: "/staff/dashboard",
    },
    {
      id: "customers",
      label: "Khách hàng",
      icon: Users,
      path: "/staff/dashboard",
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: FileText,
      path: "/staff/dashboard",
    },
  ];

  const handleMenuClick = (item: any) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-50 to-white shadow-lg border-r border-slate-200 h-full">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Xin chào bạn!
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
        </div>

        <nav className="space-y-1 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleMenuClick(item)}
                className={cn(
                  "w-full justify-start text-left font-medium h-auto py-4 px-5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-white text-gray-900 border-l-4 border-emerald-600 shadow-md"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon
                  className={cn(
                    "mr-4 h-5 w-5 transition-colors",
                    isActive ? "text-gray-900" : "text-gray-600"
                  )}
                />
                <span className="font-semibold">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default StaffSidebar;
