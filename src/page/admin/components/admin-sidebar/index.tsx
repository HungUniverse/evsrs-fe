import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  // Car,
  Users,
  UserCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  History,
  MessageSquare,
  Factory,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  hasSubmenu?: boolean;
  submenu?: {
    name: string;
    href: string;
    icon: LucideIcon;
  }[];
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   name: "Quản lý đội xe",
  //   href: "/admin/fleet-management",
  //   icon: Car,
  // },
  {
    name: "Quản lý hãng xe",
    href: "/admin/car-manufacture",
    icon: Factory,
  },
  {
    name: "Quản lý người dùng",
    href: "/admin/customer-management",
    icon: Users,
    hasSubmenu: true,
    submenu: [
      {
        name: "Danh sách người dùng",
        href: "/admin/customer-management",
        icon: Users,
      },
      {
        name: "Lịch sử thuê",
        href: "/admin/customer-management/rental-history",
        icon: History,
      },
      {
        name: "Xử lý khiếu nại",
        href: "/admin/customer-management/complaints",
        icon: MessageSquare,
      },
    ],
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

interface AdminSidebarProps {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  onSidebarClose: () => void;
  onSidebarToggle: () => void;
}

export default function AdminSidebar({
  sidebarOpen,
  sidebarCollapsed,
  onSidebarClose,
  onSidebarToggle,
}: AdminSidebarProps) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName);
  };

  const isSubmenuActive = (submenu: NavigationItem['submenu']) => {
    return submenu?.some(item => location.pathname === item.href) || false;
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "w-16" : "w-64"
      } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            const hasSubmenu = item.hasSubmenu;
            const isExpanded = hasSubmenu ? isSubmenuExpanded(item.name) : false;
            const isParentActive = hasSubmenu ? isSubmenuActive(item.submenu || []) : false;

            if (hasSubmenu) {
              return (
                <div key={item.name}>
                  {/* Parent Menu */}
                  <button
                    onClick={() => !sidebarCollapsed && toggleSubmenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                      isParentActive
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    style={isParentActive ? { backgroundColor: "#00D166" } : {}}
                    title={sidebarCollapsed ? item.name : ""}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="ml-3">{item.name}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Submenu */}
                  {!sidebarCollapsed && isExpanded && item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.href;

                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                              isSubActive
                                ? "text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            style={isSubActive ? { backgroundColor: "#00D166" } : {}}
                            onClick={onSidebarClose}
                          >
                            <SubIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="ml-3">{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular menu item without submenu
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
                onClick={onSidebarClose}
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

        {/* Collapse Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={onSidebarToggle}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group"
            title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu nhỏ sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-3">Thu nhỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
