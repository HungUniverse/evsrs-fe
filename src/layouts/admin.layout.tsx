import { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ChevronDown
} from "lucide-react";

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#00D166'}}>
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EVSRS</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{backgroundColor: '#00D166'}}>
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
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={isActive ? {backgroundColor: '#00D166'} : {}}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : ''}
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
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side - Menu toggle & Search */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop sidebar toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <PanelRight/>
              </Button>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Right side - Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  {/* Profile Image */}
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                    alt="Admin Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  
                  {/* Profile Info */}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@evsrs.com</p>
                  </div>
                  
                  {/* Chevron */}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                          alt="Admin Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Admin User</p>
                          <p className="text-xs text-gray-500">admin@evsrs.com</p>
                          <p className="text-xs" style={{color: '#00D166'}}>Quản trị viên</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4 mr-3" />
                        Hồ sơ cá nhân
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-3" />
                        Cài đặt tài khoản
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Bell className="h-4 w-4 mr-3" />
                        Thông báo
                      </button>
                      <hr className="my-2" />
                      <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
