import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
import logo from "../../../images/logo.png";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CompleteRegisterForm } from "./complete-register";
import { authAPI } from "@/apis/auth.api";

type Step = 1 | 2;

type RegisterForm = {
  email: string;
  phoneNumber: string;
  otp: string;
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
  const [step, setStep] = useState<Step>(1);
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {}, [open]);

  useEffect(() => {}, [step, otpSent, open]);

  const {
    register,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: { email: "", phoneNumber: "", otp: "" },
  });

  const email = watch("email");
  const phoneNumber = watch("phoneNumber");
  const otp = watch("otp");

  const handleSendOtp = async () => {
    if (!email || !phoneNumber) {
      toast.error("Vui lòng nhập email và số điện thoại");
      return;
    }

    setSending(true);
    try {
      const resp = await authAPI.sendOtp({ email, phoneNumber });
      const payload = (resp && (resp.data ?? resp)) as any;

      const ok =
        payload?.success === true ||
        payload?.code === "SUCCESS" ||
        payload?.statusCode === 200 ||
        payload?.status === "success";

      if (ok) {
        toast.success("Đã gửi OTP đến email của bạn");
        setStep(1);
        setOtpSent(true);
        setTimeout(() => setFocus("otp"), 0);
      } else {
        toast.error(payload?.message ?? "Không thể gửi OTP");
        setOtpSent(false);
      }
    } catch (e) {
      console.error("[sendOtp] error:", e);
      toast.error("Lỗi kết nối server");
      setOtpSent(false);
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Vui lòng nhập OTP");
      return;
    }
    try {
      const resp = await authAPI.verifyOtp({
        email,
        code: otp,
        otpType: "REGISTER",
      });

      // Unwrap cho chắc (AxiosResponse hoặc plain object)
      const payload = (resp && (resp.data ?? resp)) as any;

      const ok =
        payload?.success === true ||
        payload?.code === "SUCCESS" ||
        payload?.statusCode === 200 ||
        payload?.status === "success";

      if (ok) {
        toast.success("Xác thực OTP thành công!");
        setStep(2); // ✅ CHỈ chuyển khi chắc chắn OK
      } else {
        toast.error(payload?.message ?? "OTP không chính xác");
      }
    } catch (e) {
      console.error("[verifyOtp] error:", e);
      toast.error("Lỗi xác thực OTP");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-center gap-2 py-3">
              <img src={logo} alt="EcoRent" className="h-10" />
              <span className="text-2xl font-semibold text-green-500">
                EcoRent
              </span>
            </div>
            <div className="text-lg text-center font-medium">
              {step === 1 ? "Đăng ký - Xác thực OTP" : "Hoàn tất đăng ký"}
            </div>
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <form className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                {...register("email", { required: "Vui lòng nhập email" })}
                disabled={otpSent}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message as string}
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
                  minLength: { value: 9, message: "Tối thiểu 9 số" },
                })}
                disabled={otpSent}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phoneNumber.message as string}
                </p>
              )}
            </div>

            <DialogFooter className="mt-4 flex items-center gap-2">
              {!otpSent ? (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sending}
                >
                  Gửi OTP
                </Button>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Nhập mã OTP"
                    {...register("otp", { required: "Vui lòng nhập OTP" })}
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOtpSent(false)}
                  >
                    Nhập lại
                  </Button>
                </>
              )}

              <DialogClose asChild>
                <Button variant="secondary" type="button">
                  Hủy
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <CompleteRegisterForm
            email={email}
            phoneNumber={phoneNumber}
            onDone={() => {
              toast.success("Đăng ký thành công!");
              setStep(1);
              setOtpSent(false);
              onOpenChange?.(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
