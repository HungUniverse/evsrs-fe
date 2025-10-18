/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Eye, X as XIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

/** Reuse cách upload Cloudinary như UserPaper */
async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  if (!cloudName || !uploadPreset) {
    throw new Error("Missing VITE_CLOUDINARY_* config");
  }
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  const secure = data?.secure_url as string | undefined;
  if (!secure) throw new Error("No secure_url");
  return secure;
}

type Props = {
  label?: string;
  /** Nhiều URL, ngăn cách bằng dấu phẩy */
  value?: string | null;
  onChange?: (urlsCsv: string) => void;
  disabled?: boolean;
  multiple?: boolean; // default true
};

export default function UploadReturn({
  label = "Ảnh bàn giao",
  value,
  onChange,
  disabled,
  multiple = true,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const urls = (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function removeAt(i: number) {
    const next = urls.filter((_, idx) => idx !== i).join(", ");
    onChange?.(next);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      const list = Array.from(files).slice(0, multiple ? 99 : 1);
      const uploaded = await Promise.all(
        list.map(async (f) => {
          if (!f.type.startsWith("image/"))
            throw new Error("Chỉ chấp nhận ảnh");
          return await uploadImageToCloudinary(f);
        })
      );
      const next = [...urls, ...uploaded].join(", ");
      onChange?.(next);
      toast.success(`Tải lên ${uploaded.length} ảnh thành công`);
    } catch (e: any) {
      toast.error(e?.message || "Upload thất bại");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500">{label}</Label>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled || uploading}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Đang tải..." : "Chọn ảnh"}
        </Button>
        {!disabled && urls.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange?.("")}
            title="Xóa tất cả"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {urls.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {urls.map((u, i) => (
            <div key={u + i} className="relative group">
              <img
                src={u}
                alt={`handover-${i}`}
                className="w-full h-28 object-cover rounded border"
              />
              <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-7 w-7">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <img
                      src={u}
                      alt={`preview-${i}`}
                      className="w-full h-auto rounded"
                    />
                  </DialogContent>
                </Dialog>
                {!disabled && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeAt(i)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">Chưa có ảnh</p>
      )}
    </div>
  );
}
