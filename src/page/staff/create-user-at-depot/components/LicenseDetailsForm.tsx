import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  formData: {
    countryCode: string;
    numberMasked: string;
    licenseClass: string;
    expiredAt: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
};

const LICENSE_CLASSES = [
  "A1",
  "A2",
  "A3",
  "A4",
  "B1",
  "B2",
  "C",
  "D",
  "E",
  "F",
];

export default function LicenseDetailsForm({
  formData,
  onChange,
  errors,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin giấy phép lái xe
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Code */}
          <div className="space-y-2">
            <Label htmlFor="countryCode">
              Mã quốc gia <span className="text-red-500">VN</span>
            </Label>
            <Input
              id="countryCode"
              type="text"
              placeholder="VN"
              value={formData.countryCode}
              onChange={(e) => onChange("countryCode", e.target.value)}
              className={errors?.countryCode ? "border-red-500" : ""}
            />
            {errors?.countryCode && (
              <p className="text-sm text-red-500">{errors.countryCode}</p>
            )}
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <Label htmlFor="numberMasked">
              Số GPLX <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numberMasked"
              type="text"
              placeholder="012345678"
              value={formData.numberMasked}
              onChange={(e) => onChange("numberMasked", e.target.value)}
              className={errors?.numberMasked ? "border-red-500" : ""}
            />
            {errors?.numberMasked && (
              <p className="text-sm text-red-500">{errors.numberMasked}</p>
            )}
          </div>

          {/* License Class */}
          <div className="space-y-2">
            <Label htmlFor="licenseClass">
              Hạng GPLX <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.licenseClass}
              onValueChange={(value) => onChange("licenseClass", value)}
            >
              <SelectTrigger
                className={errors?.licenseClass ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Chọn hạng GPLX" />
              </SelectTrigger>
              <SelectContent>
                {LICENSE_CLASSES.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Hạng {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.licenseClass && (
              <p className="text-sm text-red-500">{errors.licenseClass}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiredAt">
              Ngày hết hạn <span className="text-red-500">*</span>
            </Label>
            <Input
              id="expiredAt"
              type="date"
              value={formData.expiredAt}
              onChange={(e) => onChange("expiredAt", e.target.value)}
              className={errors?.expiredAt ? "border-red-500" : ""}
            />
            {errors?.expiredAt && (
              <p className="text-sm text-red-500">{errors.expiredAt}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
