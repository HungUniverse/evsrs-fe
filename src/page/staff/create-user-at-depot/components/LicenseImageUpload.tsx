import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";
import { toast } from "sonner";

type Props = {
  frontImage: string;
  backImage: string;
  onImageChange: (field: "frontImage" | "backImage", url: string) => void;
  errors?: Record<string, string>;
};

export default function LicenseImageUpload({
  frontImage,
  backImage,
  onImageChange,
  errors,
}: Props) {
  const [uploading, setUploading] = useState<{
    front: boolean;
    back: boolean;
  }>({ front: false, back: false });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    file: File,
    type: "frontImage" | "backImage"
  ) => {
    const uploadType = type === "frontImage" ? "front" : "back";
    setUploading((prev) => ({ ...prev, [uploadType]: true }));

    try {
      const url = await uploadFileToCloudinary(file);
      onImageChange(type, url);
      toast.success(
        `Đã tải lên ${type === "frontImage" ? "mặt trước" : "mặt sau"} thành công`
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading((prev) => ({ ...prev, [uploadType]: false }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "frontImage" | "backImage"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      handleImageUpload(file, type);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ảnh giấy phép lái xe (GPLX)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Image */}
          <div className="space-y-2">
            <Label>
              Mặt trước <span className="text-red-500">*</span>
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 hover:border-emerald-500 transition-colors ${
                errors?.frontImage ? "border-red-500" : "border-gray-300"
              }`}
            >
              {frontImage ? (
                <div className="relative">
                  <img
                    src={frontImage}
                    alt="GPLX mặt trước"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => onImageChange("frontImage", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center h-48 cursor-pointer"
                  onClick={() => frontInputRef.current?.click()}
                >
                  {uploading.front ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Đang tải lên...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Nhấn để chọn ảnh
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG tối đa 5MB
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "frontImage")}
              />
            </div>
            {errors?.frontImage && (
              <p className="text-sm text-red-500">{errors.frontImage}</p>
            )}
          </div>

          {/* Back Image */}
          <div className="space-y-2">
            <Label>
              Mặt sau <span className="text-red-500">*</span>
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 hover:border-emerald-500 transition-colors ${
                errors?.backImage ? "border-red-500" : "border-gray-300"
              }`}
            >
              {backImage ? (
                <div className="relative">
                  <img
                    src={backImage}
                    alt="GPLX mặt sau"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => onImageChange("backImage", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center h-48 cursor-pointer"
                  onClick={() => backInputRef.current?.click()}
                >
                  {uploading.back ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Đang tải lên...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Nhấn để chọn ảnh
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG tối đa 5MB
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "backImage")}
              />
            </div>
            {errors?.backImage && (
              <p className="text-sm text-red-500">{errors.backImage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
