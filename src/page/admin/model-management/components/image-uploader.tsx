import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      toast.loading("Đang tải ảnh lên...", { id: "image-upload" });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      const url = await uploadFileToCloudinary(file);
      setPreviewUrl(url);
      onChange(url);
      toast.success("Tải ảnh thành công", { id: "image-upload" });
    } catch {
      toast.error("Tải ảnh thất bại", { id: "image-upload" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    void handleFiles(e.target.files);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    void handleFiles(e.dataTransfer.files);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearImage = () => {
    setPreviewUrl("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="model-image">Hình ảnh</Label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/20 transition-colors"
        onClick={() => document.getElementById("model-image-input")?.click()}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="h-24 w-auto object-contain max-w-full" />
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); document.getElementById("model-image-input")?.click(); }} disabled={isUploading}>
                {isUploading ? "Đang tải..." : "Thay ảnh"}
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); clearImage(); }} disabled={isUploading}>
                Xóa
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Kéo & thả ảnh vào đây, hoặc nhấn để chọn</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
      <input
        id="model-image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default ImageUploader;

