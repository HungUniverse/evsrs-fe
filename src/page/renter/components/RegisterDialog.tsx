import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import logo from "../../../images/logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RegisterForm = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
};
type RegisterDialogProps = {
  children?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function RegisterDialog({
  children,
  open,
  onOpenChange,
}: RegisterDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (data: RegisterForm) => {
    console.log("Register: ", data);
    reset();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className=" px-8 py-4 flex items-center gap 2 justify-center">
              <img src={logo} alt="EcoRent" className="h-15" />
              <span className="text-3xl font-semi text-green-400 ">
                EcoRent
              </span>
            </div>
            <div className="text-xl flex justify-center">Đăng Ký</div>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              {...register("username", { required: "Vui lòng nhập userName" })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: { value: 6, message: "Tối thiểu 6 kí tự" },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
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
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <Input
              type="text"
              {...register("phoneNumber", {
                required: "Vui lòng nhập số điện thoại",
                minLength: { value: 9, message: "Tối thiếu 9 số" },
              })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Huỷ
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký ..." : "Đăng ký"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
