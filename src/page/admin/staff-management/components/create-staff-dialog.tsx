import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { StaffRequest } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";
import { toast } from "sonner";

interface CreateStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  form: UseFormReturn<StaffRequest>;
  depotList: Depot[];
  onSubmit: (data: StaffRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateStaffDialog({
  isOpen,
  onOpenChange,
  onClose,
  form,
  depotList,
  onSubmit,
  isSubmitting,
}: CreateStaffDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const profilePictureUrl = watch("profilePicture");

  React.useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setValue("profilePicture", "");
    }
  }, [isOpen, setValue]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const cloudinaryUrl = await uploadFileToCloudinary(file);
      setValue("profilePicture", cloudinaryUrl, { shouldValidate: false });
      toast.success("Upload ảnh thành công");
    } catch (error) {
      console.error("Failed to upload image", error);
      toast.error("Không thể upload ảnh. Vui lòng thử lại.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setValue("profilePicture", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
          <DialogDescription>Điền đầy đủ thông tin để tạo tài khoản nhân viên mới.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <FormField
              label="Họ và tên"
              required
              error={errors.fullName?.message}
              input={
                <Input
                  placeholder="Nhập họ và tên đầy đủ"
                  {...register("fullName", {
                    required: "Họ và tên là bắt buộc",
                    minLength: { value: 2, message: "Họ và tên phải có ít nhất 2 ký tự" },
                  })}
                />
              }
            />

            <FormField
              label="Tên đăng nhập"
              required
              error={errors.userName?.message}
              input={
                <Input
                  placeholder="Nhập tên đăng nhập"
                  {...register("userName", {
                    required: "Tên đăng nhập là bắt buộc",
                    minLength: { value: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
                    },
                  })}
                />
              }
            />

            <FormField
              label="Email"
              required
              error={errors.userEmail?.message}
              input={
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  {...register("userEmail", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
              }
            />

            <FormField
              label="Số điện thoại"
              required
              error={errors.phoneNumber?.message}
              input={
                <Input
                  placeholder="Nhập số điện thoại"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onInput={(e) => {
                    const target = e.currentTarget;
                    const digitsOnly = target.value.replace(/\D/g, "");
                    if (digitsOnly !== target.value) {
                      target.value = digitsOnly;
                    }
                  }}
                  {...register("phoneNumber", {
                    required: "Số điện thoại là bắt buộc",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Số điện thoại phải có 10-11 chữ số",
                    },
                  })}
                />
              }
            />

            <FormField
              label="Ngày sinh"
              required
              error={errors.dateOfBirth?.message}
              input={
                <Input
                  type="date"
                  {...register("dateOfBirth", {
                    required: "Ngày sinh là bắt buộc",
                  })}
                />
              }
            />

            <FormField
              label="Trạm làm việc"
              required
              error={errors.depotId?.message}
              input={
                <Select
                  onValueChange={(value) => setValue("depotId", value, { shouldValidate: true })}
                  value={watch("depotId") || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạm làm việc" />
                  </SelectTrigger>
                  <SelectContent>
                    {depotList.map((depot) => (
                      <SelectItem key={depot.id} value={depot.id}>
                        {depot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            />

            <div className="space-y-2">
              <Label>Ảnh đại diện</Label>
              <div className="space-y-3">
                {(previewUrl || profilePictureUrl) && (
                  <div className="relative inline-block">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-muted">
                      <img
                        src={previewUrl || profilePictureUrl || ""}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading || isSubmitting}
                    className="hidden"
                    id="profile-picture-upload"
                  />
                  <Label
                    htmlFor="profile-picture-upload"
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Đang upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">
                          {previewUrl || profilePictureUrl ? "Thay đổi ảnh" : "Chọn ảnh đại diện"}
                        </span>
                      </>
                    )}
                  </Label>
                  {!previewUrl && !profilePictureUrl && (
                    <p className="text-xs text-muted-foreground">Tối đa 5MB, định dạng JPG/PNG</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-4 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo nhân viên"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  input: React.ReactNode;
}

function FormField({ label, required, error, input }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? <span className="text-red-500 ml-1">*</span> : null}
      </Label>
      {input}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

