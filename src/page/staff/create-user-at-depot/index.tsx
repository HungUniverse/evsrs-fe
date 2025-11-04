import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { authAPI } from "@/apis/auth.api";
import type { UserAtDepotRequest } from "@/@types/auth.type";
import PersonalInfoForm from "./components/PersonalInfoForm";
import LicenseImageUpload from "./components/LicenseImageUpload";
import LicenseDetailsForm from "./components/LicenseDetailsForm";

function CreateUserAtDepot() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UserAtDepotRequest>({
    userEmail: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    frontImage: "",
    backImage: "",
    countryCode: "VN",
    numberMasked: "",
    licenseClass: "",
    expiredAt: "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (
    field: "frontImage" | "backImage",
    url: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: url }));
    // Clear error when image is uploaded
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal Info
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = "Email không hợp lệ";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // License Images
    if (!formData.frontImage) {
      newErrors.frontImage = "Vui lòng tải lên ảnh mặt trước GPLX";
    }
    if (!formData.backImage) {
      newErrors.backImage = "Vui lòng tải lên ảnh mặt sau GPLX";
    }

    // License Details
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Vui lòng nhập mã quốc gia";
    }
    if (!formData.numberMasked.trim()) {
      newErrors.numberMasked = "Vui lòng nhập số GPLX";
    }
    if (!formData.licenseClass) {
      newErrors.licenseClass = "Vui lòng chọn hạng GPLX";
    }
    if (!formData.expiredAt) {
      newErrors.expiredAt = "Vui lòng chọn ngày hết hạn";
    } else {
      const expiryDate = new Date(formData.expiredAt);
      const today = new Date();
      if (expiryDate < today) {
        newErrors.expiredAt = "GPLX đã hết hạn";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.registerAtDepot(formData);

      toast.success("Đăng ký tài khoản thành công!");
      console.log("Registration response:", response.data);

      // Navigate to create order page with user data
      setTimeout(() => {
        navigate("/staff/create-order-at-depot", {
          state: response.data.data,
        });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tạo tài khoản khách hàng tại điểm thuê
        </h1>
        <p className="text-gray-600 mt-2">
          Đăng ký tài khoản mới cho khách hàng đến thuê xe trực tiếp tại trạm
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-8">
          {/* Personal Information */}
          <PersonalInfoForm
            formData={{
              fullName: formData.fullName,
              userEmail: formData.userEmail,
              phoneNumber: formData.phoneNumber,
              password: formData.password,
            }}
            onChange={handleFieldChange}
            errors={errors}
          />

          <div className="border-t pt-8">
            {/* License Images */}
            <LicenseImageUpload
              frontImage={formData.frontImage}
              backImage={formData.backImage}
              onImageChange={handleImageChange}
              errors={errors}
            />
          </div>

          <div className="border-t pt-8">
            {/* License Details */}
            <LicenseDetailsForm
              formData={{
                countryCode: formData.countryCode,
                numberMasked: formData.numberMasked,
                licenseClass: formData.licenseClass,
                expiredAt: formData.expiredAt,
              }}
              onChange={handleFieldChange}
              errors={errors}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                "Tiếp tục"
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

export default CreateUserAtDepot;
