import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  formData: {
    fullName: string;
    userEmail: string;
    phoneNumber: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
};

export default function PersonalInfoForm({
  formData,
  onChange,
  errors,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className={errors?.fullName ? "border-red-500" : ""}
            />
            {errors?.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="userEmail">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="email@example.com"
              value={formData.userEmail}
              onChange={(e) => onChange("userEmail", e.target.value)}
              className={errors?.userEmail ? "border-red-500" : ""}
            />
            {errors?.userEmail && (
              <p className="text-sm text-red-500">{errors.userEmail}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="0912345678"
              value={formData.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              className={errors?.phoneNumber ? "border-red-500" : ""}
            />
            {errors?.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
              className={errors?.password ? "border-red-500" : ""}
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
