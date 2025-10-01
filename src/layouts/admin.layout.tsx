import { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import {
  LayoutDashboard,
  Car,
  Users,
  UserCheck,
  BarChart3,
  Menu,
  X,
  LogOut,
  Search,
  Bell,
  Settings,
  User,
  PanelRight,
  ChevronDown,
} from "lucide-react";
import HeaderLite from "@/page/renter/components/layout/headerLite";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Quản lý đội xe",
    href: "/admin/fleet-management",
    icon: Car,
  },
  {
    name: "Quản lý khách hàng",
    href: "/admin/customer-management",
    icon: Users,
  },
  {
    name: "Quản lý nhân viên",
    href: "/admin/staff-management",
    icon: UserCheck,
  },
  {
    name: "Báo cáo & Phân tích",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, clear } = useAuthStore();

  // Redirect to login if not authenticated

  const handleLogout = () => {
    clear();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-16" : "w-64"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#00D166" }}
                >
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EVSRS</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#00D166" }}
              >
                <Car className="h-5 w-5 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    isActive
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  style={isActive ? { backgroundColor: "#00D166" } : {}}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : ""}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <HeaderLite />

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
