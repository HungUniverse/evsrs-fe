import { useState, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, X, CheckCircle2, CircleAlert, Upload, Eye, X as XIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { identifyDocumentAPI } from "@/apis/identify-document.api";
import { useEffect } from "react";
import type { IdentifyDocumentRequest, IdentifyDocumentResponse } from "@/@types/identify-document";

type PaperStatus = "pending" | "approved" | "rejected";

//Hàm upload ảnh lên Cloudinary
async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary config missing (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)"
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }
  const data = await res.json();
  if (!data?.secure_url) {
    throw new Error("Cloudinary response missing secure_url");
  }
  return data.secure_url as string;
}

export default function UserPaper() {
  const { user, isAuthenticated } = useAuthStore();
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState<PaperStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    licenseNumber: "",
    fullName: user?.name ?? "",
    expiryDate: "",
    licenseClass: "B1", // Mặc định B1
    countryCode: "VN", // Mặc định Việt Nam
    frontImage: null as File | null, // ảnh mặt trước
    backImage: null as File | null, // ảnh mặt sau
  });
  const [initialImages, setInitialImages] = useState<{
    front?: string | null;
    back?: string | null;
  }>({});
  const [savedForm, setSavedForm] = useState<typeof form | null>(null);
  const [savedImages, setSavedImages] = useState<{
    front?: string | null;
    back?: string | null;
  } | null>(null);

  // Helper: lấy document hiện tại (nếu có). Trả về null nếu không tìm thấy
  const fetchExistingDocument =
    useCallback(async (): Promise<IdentifyDocumentResponse | null> => {
      if (!user?.userId) return null;
      try {
        const res = await identifyDocumentAPI.getUserDocuments(user.userId);
        return (res?.data as IdentifyDocumentResponse) ?? null;
      } catch (err: unknown) {
        const apiError = err as {
          response?: { data?: { error?: string; message?: string } };
        };
        const notFoundMsg =
          apiError?.response?.data?.error || apiError?.response?.data?.message;
        if (notFoundMsg && /not found/i.test(notFoundMsg)) {
          return null;
        }
        throw err;
      }
    }, [user?.userId]);

  function onChange<K extends keyof typeof form>(
    key: K,
    val: string | File | null
  ) {
    setForm((s) => ({ ...s, [key]: val }));
  }

  //Hàm upload/cập nhật giấy tờ lên server(qua API)
  async function onSave() {
    if (!user?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    setIsLoading(true);

    // Validation
    if (!form.licenseNumber.trim()) {
      toast.error("Vui lòng nhập số giấy phép lái xe");
      setIsLoading(false);
      return;
    }
    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      setIsLoading(false);
      return;
    }
    if (!form.expiryDate) {
      toast.error("Vui lòng nhập ngày hết hạn");
      setIsLoading(false);
      return;
    }

    try {
      // Kiểm tra lại xem user đã có document chưa
      const existing = await fetchExistingDocument();

      // Chuẩn bị URL ảnh: chỉ upload ảnh mới nếu có, nếu không dùng ảnh cũ (khi update)
      let frontUrl: string | null = existing?.frontImage ?? null;
      let backUrl: string | null = existing?.backImage ?? null;

      const uploaders: Array<Promise<string>> = [];
      const needsFrontUpload = !!form.frontImage;
      const needsBackUpload = !!form.backImage;

      if (needsFrontUpload && form.frontImage)
        uploaders.push(uploadImageToCloudinary(form.frontImage));
      if (needsBackUpload && form.backImage)
        uploaders.push(uploadImageToCloudinary(form.backImage));

      if (uploaders.length) {
        const results = await Promise.all(uploaders);
        let idx = 0;
        if (needsFrontUpload && form.frontImage) {
          frontUrl = results[idx++];
        }
        if (needsBackUpload && form.backImage) {
          backUrl = results[idx++];
        }
      }

      // Nếu là tạo mới thì bắt buộc phải có đủ 2 ảnh
      const isCreate = !existing;
      if (isCreate && (!frontUrl || !backUrl)) {
        toast.error("Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau");
        setIsLoading(false);
        return;
      }

      if (isCreate) {
        const requestData: IdentifyDocumentRequest = {
          userId: user.userId,
          frontImage: frontUrl as string,
          backImage: backUrl as string,
          countryCode: form.countryCode,
          numberMasked: form.licenseNumber,
          licenseClass: form.licenseClass,
          expireAt: new Date(form.expiryDate).toISOString(),
          status: "PENDING",
          note: `Họ tên: ${form.fullName}`,
        };
        const response = await identifyDocumentAPI.upload(requestData);
        if (
          response.code === "SUCCESS" &&
          (response.statusCode === 201 || response.statusCode === 200)
        ) {
          toast.success(response.message || "Đã gửi giấy tờ để xác thực");
        } else {
          toast.error(response.message || "Lưu thất bại, thử lại sau");
          setIsLoading(false);
          return;
        }
      } else {
        const response = await identifyDocumentAPI.update(existing.id, {
          userId: user.userId,
          frontImage: frontUrl ?? undefined,
          backImage: backUrl ?? undefined,
          countryCode: form.countryCode,
          numberMasked: form.licenseNumber,
          licenseClass: form.licenseClass,
          expireAt: new Date(form.expiryDate).toISOString(),
          status: "PENDING",
          note: `Họ tên: ${form.fullName}`,
        });
        if (
          response.code === "SUCCESS" &&
          (response.statusCode === 200 || response.statusCode === 204)
        ) {
          toast.success(response.message || "Cập nhật giấy tờ thành công");
        } else {
          toast.error(response.message || "Cập nhật thất bại, thử lại sau");
          setIsLoading(false);
          return;
        }
      }

      // Làm mới dữ liệu sau khi lưu
      const refreshed = await fetchExistingDocument();
      if (refreshed) {
        setStatus(
          refreshed.status === "APPROVED"
            ? "approved"
            : refreshed.status === "PENDING"
              ? "pending"
              : "rejected"
        );
        setForm((s) => ({
          ...s,
          licenseNumber: refreshed.numberMasked || "",
          licenseClass: refreshed.licenseClass || s.licenseClass,
          countryCode: refreshed.countryCode || s.countryCode,
          expiryDate: refreshed.expireAt
            ? new Date(refreshed.expireAt).toISOString().slice(0, 10)
            : s.expiryDate,
          frontImage: null,
          backImage: null,
        }));
        setInitialImages({
          front: refreshed.frontImage ?? null,
          back: refreshed.backImage ?? null,
        });
      }
      setEdit(false);
      setIsLoading(false);
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Lưu thất bại, thử lại sau";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const load = async () => {
      if (!user?.userId) return;
      try {
        const latest = await fetchExistingDocument();
        if (latest) {
          setStatus(
            latest.status === "APPROVED"
              ? "approved"
              : latest.status === "PENDING"
                ? "pending"
                : "rejected"
          );
          setForm((s) => ({
            ...s,
            licenseNumber: latest.numberMasked || "",
            licenseClass: latest.licenseClass || s.licenseClass,
            countryCode: latest.countryCode || s.countryCode,
            expiryDate: latest.expireAt
              ? new Date(latest.expireAt).toISOString().slice(0, 10)
              : s.expiryDate,
            frontImage: null,
            backImage: null,
          }));
          setInitialImages({
            front: latest.frontImage ?? null,
            back: latest.backImage ?? null,
          });
        } else {
          // Không có dữ liệu: đặt trống UI
          setStatus("pending");
          setForm((s) => ({
            ...s,
            licenseNumber: "",
            expiryDate: "",
            frontImage: null,
            backImage: null,
          }));
          setInitialImages({ front: null, back: null });
        }
      } catch (e) {
        // Lỗi khác ngoài not found
        console.error(e);
        toast.error("Không thể tải giấy tờ. Vui lòng thử lại sau");
      }
    };
    load();
  }, [user?.userId, fetchExistingDocument]);

  if (!isAuthenticated) return null;

  return (
    <section className="rounded-xl border bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Giấy phép lái xe</h3>
          <StatusPill status={status} />
        </div>

        {!edit ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSavedForm(form);
              setSavedImages(initialImages);
              setEdit(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (savedForm) setForm(savedForm);
                if (savedImages) setInitialImages(savedImages);
                setEdit(false);
              }}
            >
              <X className="mr-2 h-4 w-4" /> Hủy
            </Button>
          </div>
        )}
      </div>

      <div className="mx-6 mb-4 rounded-md bg-rose-50 text-rose-700 text-sm p-3 flex items-start gap-2">
        <CircleAlert className="h-4 w-4 mt-0.5" />
        <p>
          Lưu ý: người đặt xe phải là người nhận xe. Vui lòng nhập đúng thông
          tin theo GPLX/CCCD để tránh phát sinh vấn đề khi nhận xe.
        </p>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <ImageUpload
            label="Mặt trước GPLX"
            file={form.frontImage}
            onChange={(file) => onChange("frontImage", file)}
            disabled={!edit}
            initialUrl={initialImages.front || null}
            onRemove={() => setInitialImages((s) => ({ ...s, front: null }))}
          />
          <ImageUpload
            label="Mặt sau GPLX"
            file={form.backImage}
            onChange={(file) => onChange("backImage", file)}
            disabled={!edit}
            initialUrl={initialImages.back || null}
            onRemove={() => setInitialImages((s) => ({ ...s, back: null }))}
          />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Số GPLX"
            value={form.licenseNumber}
            onChange={(v) => onChange("licenseNumber", v)}
            disabled={!edit}
          />
          <Field
            label="Hạng GPLX"
            value={form.licenseClass}
            onChange={(v) => onChange("licenseClass", v)}
            disabled={!edit}
          />
          <Field
            label="Quốc gia"
            value={form.countryCode}
            onChange={(v) => onChange("countryCode", v)}
            disabled={!edit}
          />
          <Field
            label="Họ và tên"
            value={form.fullName}
            onChange={(v) => onChange("fullName", v)}
            disabled={!edit}
          />
          <Field
            label="Ngày hết hạn"
            type="date"
            value={form.expiryDate}
            onChange={(v) => onChange("expiryDate", v)}
            disabled={!edit}
          />
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: PaperStatus }) {
  const map = {
    pending: { text: "Đang chờ duyệt", cls: "bg-amber-100 text-amber-800" },
    approved: { text: "Đã xác thực", cls: "bg-emerald-100 text-emerald-800" },
    rejected: { text: "Đã từ chối", cls: "bg-red-100 text-red-800" },
  } as const;
  const it = map[status];
  return (
    <span className={`text-xs px-2 py-1 rounded-md ${it.cls}`}>{it.text}</span>
  );
}

function ImageUpload({
  label,
  file,
  onChange,
  disabled,
  initialUrl,
  onRemove,
}: {
  label: string;
  file: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  initialUrl?: string | null;
  onRemove?: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith("image/")) {
      onChange?.(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      toast.error("Vui lòng chọn file ảnh");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange?.(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onRemove?.();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const effectivePreview = previewUrl || initialUrl || null;

  return (
    <div>
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="mt-1">
        {file || effectivePreview ? (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {file?.name || "Ảnh đã tải lên"}
              </span>
              <div className="flex gap-2">
                {effectivePreview && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <img
                        src={effectivePreview}
                        alt={label}
                        className="w-full h-auto rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                )}
                {!disabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {effectivePreview && (
              <img
                src={effectivePreview}
                alt={label}
                className="w-full h-32 object-cover rounded border"
              />
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload
                className={`mx-auto h-8 w-8 ${isDragOver ? "text-blue-400" : "text-gray-400"}`}
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={disabled}
                  className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer ${
                    isDragOver
                      ? "text-blue-600"
                      : "text-blue-600 hover:text-blue-500"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isDragOver ? "Thả file vào đây" : "Tải lên ảnh"}
                </button>
                <input
                  ref={fileInputRef}
                  id={`file-upload-${label}`}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={disabled}
                  style={{ display: "none" }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF tối đa 10MB
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Hoặc kéo thả file vào đây
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  type?: "text" | "date";
}) {
  return (
    <div>
      <Label className="text-xs text-slate-500">{label}</Label>
      <Input
        className="mt-1"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        type={type}
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
    </div>
  );
}
