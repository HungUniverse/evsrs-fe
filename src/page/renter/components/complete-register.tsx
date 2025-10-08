import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import authAPI from "@/apis/auth.api";

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

      if (res.data.success) {
        toast.success("Đăng ký thành công!");
        onDone?.();
      } else {
        toast.error(res.data.message ?? "Không thể đăng ký");
      }
    } catch {
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
        <Input
          type="password"
          {...register("password", {
            required: "Vui lòng nhập mật khẩu",
            minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
          })}
        />
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
        <Input
          type="password"
          {...register("confirmPassword", {
            required: "Vui lòng xác nhận mật khẩu",
          })}
        />
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
