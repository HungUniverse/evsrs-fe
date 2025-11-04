// src/page/renter/components/login-dialog.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "../../../images/logo.png";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { toast } from "sonner";
import { authAPI } from "@/apis/auth.api";

type LoginDialogProps = {
  children: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSwitchToRegister?: () => void;
};

type LoginForm = {
  identifier: string;
  password: string;
};

export function LoginDialog({
  children,
  open,
  onOpenChange,
  onSwitchToRegister,
}: LoginDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginForm>({
    defaultValues: { identifier: "", password: "" },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { save } = useAuthStore(); // ✅ dùng save() để lưu token & decode JWT

  const onSubmit = async (form: LoginForm) => {
    try {
      const res = await authAPI.login(form);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = res?.data ?? res;
      const ok =
        payload?.success === true ||
        payload?.code === "SUCCESS" ||
        payload?.statusCode === 200 ||
        (payload?.data?.accessToken && !("success" in payload)); // trường hợp trả thẳng

      if (!ok || !payload?.data?.accessToken) {
        toast.error(payload?.message ?? "Đăng nhập thất bại!");
        return;
      }

      const accessToken: string = payload.data.accessToken;
      const refreshToken: string = payload.data.refreshToken ?? "";

      // ✅ Lưu vào store (store sẽ tự decode -> có user & role 1|2|3)
      save({ accessToken, refreshToken });

      // ✅ Đóng modal trước khi điều hướng
      onOpenChange?.(false);

      // ✅ Điều hướng theo role (đã decode trong store)
      const state = useAuthStore.getState();
      const role = state.user?.role;

      const from =
        (location.state as { from?: { pathname?: string } } | null | undefined)
          ?.from?.pathname || undefined;

      setTimeout(() => {
        if (role === "ADMIN") navigate("/admin", { replace: true });
        else if (role === "STAFF") navigate("/staff", { replace: true });
        else if (from) navigate(from, { replace: true });
        else navigate("/", { replace: true });
      }, 0);

      toast.success("Đăng nhập thành công!");
      reset();
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Đăng nhập thất bại. Kiểm tra lại thông tin!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] sm:max-h-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="px-8 py-4 flex items-center gap-2 justify-center">
              <img src={logo} alt="EcoRent" className="h-15" />
              <span className="text-3xl font-semibold text-green-400">
                EcoRent
              </span>
            </div>
            <div className="text-xl flex justify-center">Đăng Nhập</div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email/Username
            </label>
            <Input
              type="text"
              placeholder="Nhập email hoặc username"
              {...register("identifier", {
                required: "Vui lòng nhập email hoặc username",
              })}
            />
            {errors.identifier && (
              <p className="text-sm text-red-500 mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </DialogFooter>
        </form>

        <p className="mt-3 text-center text-sm flex justify-center items-center gap-2 whitespace-nowrap">
          Bạn chưa có tài khoản?
          <span
            onClick={() => {
              onOpenChange?.(false);
              onSwitchToRegister?.();
            }}
            className="text-emerald-600 font-medium hover:underline cursor-pointer"
          >
            Đăng ký tài khoản
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
