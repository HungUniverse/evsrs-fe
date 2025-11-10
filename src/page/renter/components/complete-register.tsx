import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { authAPI } from "@/apis/auth.api";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  email: string;
  phoneNumber: string;
  onDone?: () => void;
};

type PasswordForm = {
  password: string;
  confirmPassword: string;
};

export function CompleteRegisterForm({ email, phoneNumber, onDone }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const confirm = watch("confirmPassword");

  const onSubmit = async (data: PasswordForm) => {
    if (password !== confirm) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await authAPI.completeRegister({
        email,
        phoneNumber,
        password: data.password,
      });

      // Check multiple possible success indicators
      const payload = res?.data ?? res;
      const ok =
        payload?.success === true ||
        payload?.code === "SUCCESS" ||
        payload?.statusCode === 200 ||
        res.status === 200;

      if (ok) {
        onDone?.();
      } else {
        toast.error(payload?.message ?? "Không thể đăng ký");
      }
    } catch (error) {
      console.error("Complete register error:", error);
      toast.error("Lỗi server khi hoàn tất đăng ký");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input value={email} disabled />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số điện thoại</label>
        <Input value={phoneNumber} disabled />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
            })}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">
            {errors.password.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu",
            })}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {password !== confirm && (
          <p className="text-sm text-red-500 mt-1">Mật khẩu không khớp</p>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
        </Button>
      </DialogFooter>
    </form>
  );
}
