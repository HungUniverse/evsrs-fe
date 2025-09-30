import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "../../../../images/logo.png";
import { LoginDialog } from "../LoginDialog";
import { RegisterDialog } from "../RegisterDialog";

export default function Header() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <header className="bg-black text-white px-8 py-4 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => window.location.href = "/"}
      >
        <img src={logo} alt="EcoRent" className="h-14" />
        <span className="text-2xl font-bold text-green-400 mt-2">EcoRent</span>
      </div>
      <nav className="text-lg flex gap-8">
        <a
          href="/"
          className="font-semibold text-green-400 hover:text-green-300 transition-colors"
        >
          Trang chủ
        </a>
        <a
          href="#"
          className="font-semibold hover:text-green-400 transition-colors"
        >
          Giá dịch vụ
        </a>
        <a
          href="#"
          className="font-semibold hover:text-green-400 transition-colors"
        >
          Vì chúng tôi
        </a>
        <a
          href="#"
          className="font-semibold hover:text-green-400 transition-colors"
        >
          Liên hệ
        </a>
      </nav>
      <LoginDialog
        open={openLogin}
        onOpenChange={setOpenLogin}
        onSwitchToRegister={() => setOpenRegister(true)}
      >
        <Button
          className="text-md bg-green-500 text-white px-6 py-6 rounded-full"
          onClick={() => setOpenLogin(true)}
        >
          Đăng nhập
        </Button>
      </LoginDialog>
      <RegisterDialog open={openRegister} onOpenChange={setOpenRegister} />
    </header>
  );
}
