import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import logo from "../../../../images/logo.png";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/page/renter/components/LoginDialog";
import { RegisterDialog } from "@/page/renter/components/RegisterDialog";
import { Bell, Settings, User, LogOut, IdCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderLite() {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const goProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto w-full max-w-6xl h-16 px-4 flex items-center justify-between">
        {/* Logo + brand */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <img src={logo} alt="EcoRent" className="h-16" />
          <span className="font-bold text-emerald-600 text-2xl mt-3">
            EcoRent
          </span>
        </div>

        {/* Right zone */}
        <div className="flex items-center gap-4 text-slate-700">
          <a
            href="#"
            className="hidden md:inline-block text-sm font-medium hover:text-emerald-600"
          >
            Về EcoRent
          </a>

          <span className="hidden md:block w-px h-5 bg-slate-300/70" />

          {isAuthenticated ? (
            <>
              {/* Icons */}
              <button
                aria-label="Thông báo"
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 transition"
              >
                <Bell className="h-5 w-5" />
              </button>

              <button
                aria-label="Cài đặt"
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-100 transition"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Dropdown tài khoản */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-lg border px-3 py-1.5 hover:bg-slate-50 transition-colors"
                    aria-label="Tài khoản"
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                      {/* Nếu có avatar thật, thay icon bằng <img src={user?.avatarUrl} className="h-7 w-7 rounded-full" /> */}
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {user?.name || "Người dùng"}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={goProfile}
                    className="cursor-pointer"
                  >
                    <IdCard className="mr-2 h-4 w-4" />
                    <span>Trang cá nhân</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <button
                onClick={() => setOpenRegister(true)}
                className="hidden md:inline-block text-sm font-medium hover:text-emerald-600"
              >
                Đăng ký
              </button>

              <span className="hidden md:block w-px h-5 bg-slate-300/70" />

              <LoginDialog
                open={openLogin}
                onOpenChange={setOpenLogin}
                onSwitchToRegister={() => setOpenRegister(true)}
              >
                <Button
                  variant="outline"
                  className="font-semibold rounded-b-sm px-5 h-9 border-slate-800 hover:bg-slate-50"
                  onClick={() => setOpenLogin(true)}
                >
                  Đăng Nhập
                </Button>
              </LoginDialog>

              <RegisterDialog
                open={openRegister}
                onOpenChange={setOpenRegister}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
