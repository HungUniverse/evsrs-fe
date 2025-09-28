import { Button } from "@/components/ui/button";
import logo from "../../../../images/logo.png";
import { LoginDialog } from "@/page/renter/components/LoginDialog";
import { RegisterDialog } from "@/page/renter/components/RegisterDialog";
import { useState } from "react";
export default function SearchHeader() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img src={logo} alt="EcoRent" className="h-16" />
          <span className="font-bold text-emerald-600 text-2xl mt-3">
            EcoRent
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-700">
          <a
            href="#"
            className="hidden md:inline-block hover:text-emerald-600 font-semibold"
          >
            Về EcoRent
          </a>

          <span className="hidden md:block h-5 w-px bg-slate-300/70" />

          <button
            onClick={() => setOpenRegister(true)}
            className="hidden md:inline-block font-semibold text-slate-700 hover:text-emerald-600"
          >
            Đăng ký
          </button>

          <span className="hidden md:block h-5 w-px bg-slate-300/70" />

          <LoginDialog
            open={openLogin}
            onOpenChange={setOpenLogin}
            onSwitchToRegister={() => setOpenRegister(true)}
          >
            <Button
              variant="outline"
              className=" font-semibold rounded-full px-5 h-10 border-slate-300 hover:bg-slate-50"
              onClick={() => setOpenLogin(true)}
            >
              Đăng Nhập
            </Button>
          </LoginDialog>

          <RegisterDialog open={openRegister} onOpenChange={setOpenRegister} />
        </div>
      </div>
    </header>
  );
}
