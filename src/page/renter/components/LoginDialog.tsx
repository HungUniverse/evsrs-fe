import type React from "react";
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

type LoginDialogProps = {
  children: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSwitchToRegister?: () => void;
};
type LoginForm = { email: string; password: string };

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
  } = useForm<LoginForm>({ defaultValues: { email: "", password: "" } });

  const onSubmit = (data: LoginForm) => {
    console.log("LOGIN", data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px] sm:max-h-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className=" px-8 py-4 flex items-center gap 2 justify-center">
              <img src={logo} alt="EcoRent" className="h-15" />
              <span className="text-3xl font-semi text-green-400 ">
                EcoRent
              </span>
            </div>
            <div className="text-xl flex justify-center">Đăng Nhập</div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu của bạn",
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
            <br />
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
