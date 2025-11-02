import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollText, BarChart3 } from "lucide-react";
const items = [
  { to: "/staff/dashboard", label: "Tổng quan", icon: BarChart3 },
  { to: "/staff/trip", label: "Quản lý chuyến đi", icon: ScrollText },
  { to: "/staff/car", label: "Quản lý xe trong trạm", icon: ScrollText },
];

export default function StaffSidebar() {
  const location = useLocation();

  const handleNavClick = (to: string) => {
    // If clicking on the same route, refresh the page
    if (location.pathname === to) {
      window.location.reload();
    }
  };

  return (
    <aside className="w-full lg:w-64 border-r bg-white">
      <div className="px-4 py-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Xin chào Staff!
        </h2>
      </div>

      <nav className="px-2 pb-4 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => handleNavClick(to)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-slate-50",
                isActive
                  ? "bg-slate-100 text-slate-900 border-l-2 border-emerald-500"
                  : "text-slate-600"
              )
            }
            end={to === "/my-profile"}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
