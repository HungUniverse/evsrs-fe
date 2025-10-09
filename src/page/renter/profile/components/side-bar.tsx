import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRound, ScrollText, KeyRound } from "lucide-react";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  end?: boolean;
};

const items: Item[] = [
  {
    to: "/account/my-profile",
    label: "Tài khoản của tôi",
    icon: UserRound,
    end: true,
  },
  { to: "/account/my-trip", label: "Chuyến của tôi", icon: ScrollText },
  {
    to: "/account/change-password",
    label: "Đổi mật khẩu",
    icon: KeyRound,
    end: true,
  },
];

export default function AccountSidebar() {
  return (
    <aside className="w-full lg:w-64 border-r bg-white">
      <div className="px-4 py-5">
        <h2 className="text-xl font-semibold text-slate-800">Xin chào bạn!</h2>
      </div>

      <nav className="px-2 pb-4 space-y-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-slate-50",
                isActive
                  ? "bg-slate-100 text-slate-900 border-l-2 border-emerald-500"
                  : "text-slate-600"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
