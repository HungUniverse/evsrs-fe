import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";

interface LogoUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  const onFileSelected = async (file?: File) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadFileToCloudinary(file);
      setPreviewUrl(url);
      onChange(url);
    } catch {
      // no-op
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    void onFileSelected(file);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void onFileSelected(file);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const clearImage = () => {
    setPreviewUrl("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Logo</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/20"
        onClick={() => document.getElementById("logo-file-input")?.click()}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center gap-2">
            <img src={previewUrl} alt="Logo preview" className="w-20 h-20 object-contain" />
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById("logo-file-input")?.click()} disabled={isUploading}>
                {isUploading ? "Đang tải..." : "Thay ảnh"}
              </Button>
              <Button type="button" size="sm" variant="destructive" onClick={clearImage} disabled={isUploading}>
                Xóa
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Kéo và thả ảnh vào đây, hoặc bấm để chọn</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
      <Input id="logo-file-input" type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
    </div>
  );
};

export default LogoUploader;

