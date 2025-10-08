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
import authAPI from "@/apis/auth.api";
import type { ApiResp, LoginResponse } from "@/@types/auth.type";
import { toast } from "sonner";
import type { RoleCode } from "@/@types/auth.type";

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
  const { loginSuccess } = useAuthStore();

  const onSubmit = async (form: LoginForm) => {
    try {
      const res = await authAPI.login(form);
      // API may return {code:"SUCCESS", statusCode:200, data:{accessToken, refreshToken}}
      const payload = (res?.data ?? res) as Partial<
        ApiResp<LoginResponse>
      > & { code?: string; statusCode?: number };
      const ok =
        payload?.success === true ||
        payload?.code === "SUCCESS" ||
        payload?.statusCode === 200;
      if (!ok || !payload?.data?.accessToken) {
        toast.error(payload?.message ?? "Đăng nhập thất bại!");
        return;
      }

      const accessToken: string = payload.data.accessToken;
      localStorage.setItem("token", JSON.stringify(accessToken));

      // Decode JWT to build a minimal User for header (fallback khi BE chưa trả user)
      const decodeJwt = (t: string) => {
        try {
          const base = t.split(".")[1];
          const json = atob(base.replace(/-/g, "+").replace(/_/g, "/"));
          return JSON.parse(json) as {
            userId?: string;
            username?: string;
            name?: string;
            email?: string;
            role?: string;
          };
        } catch {
          return {} as Record<string, unknown> as {
            userId?: string;
            username?: string;
            name?: string;
            email?: string;
            role?: string;
          };
        }
      };

      const claims = decodeJwt(accessToken);
      const mapRole = (r?: string): RoleCode => {
        switch ((r || "USER").toUpperCase()) {
          case "ADMIN":
            return 1;
          case "STAFF":
            return 2;
          default:
            return 3;
        }
      };

      const normalizedUser: {
        id: string;
        userName: string;
        password: string;
        fullName: string;
        email: string;
        dob: string;
        phoneNumber: string;
        profilePicture: string;
        role: RoleCode;
        cccd: string;
        gplx: string;
      } = {
        id: claims.userId || "",
        userName:
          claims.username || claims.name || (claims.email ? claims.email.split("@")[0] : "User"),
        password: "",
        fullName: claims.name || "",
        email: claims.email || form.identifier,
        dob: "",
        phoneNumber: "",
        profilePicture: "",
        role: mapRole(claims.role),
        cccd: "",
        gplx: "",
      };

      // Lưu vào Zustand (kích hoạt header render lại)
      loginSuccess({ token: accessToken, user: normalizedUser });

      const from = (location.state as { from?: { pathname?: string } } | null | undefined)?.from?.pathname as
        | string
        | undefined;

      // Close modal first, then navigate (ensure UI updates)
      onOpenChange?.(false);
      setTimeout(() => {
        if (normalizedUser.role === 1) navigate("/admin", { replace: true });
        else if (normalizedUser.role === 2) navigate("/staff", { replace: true });
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

  // 🧱 Giao diện
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
          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email/Username
            </label>
            <Input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              {...register("identifier", {
                required: "Vui lòng nhập email hoặc số điện thoại",
                minLength: { value: 5, message: "Tối thiểu 5 ký tự" },
              })}
            />
            {errors.identifier && (
              <p className="text-sm text-red-500 mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
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

          {/* Footer */}
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

        {/* Switch to Register */}
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
