import { useState, useRef } from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, X, CheckCircle2, CircleAlert, Upload, Eye, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { identifyDocumentAPI, type IdentifyDocumentRequest } from "@/apis/identify-document.api";

type PaperStatus = "unverified" | "pending" | "verified";

export default function UserPaper() {
  const { user, isAuthenticated } = useAuthStore();
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState<PaperStatus>("unverified");

  const [form, setForm] = useState({
    licenseNumber: "",
    cccd: "",
    fullName: user?.name ?? "",
    dob: "",
    address: "",
    issueDate: "",
    expiryDate: "",
    licenseClass: "B1", // Mặc định B1
    countryCode: "VN", // Mặc định Việt Nam
    frontImage: null as File | null, // ảnh mặt trước
    backImage: null as File | null, // ảnh mặt sau
  });

  if (!isAuthenticated) return null;

  function onChange<K extends keyof typeof form>(key: K, val: string | File | null) {
    setForm((s) => ({ ...s, [key]: val }));
  }

  async function onSave() {
    if (!user?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    // Validation
    if (!form.licenseNumber.trim()) {
      toast.error("Vui lòng nhập số giấy phép lái xe");
      return;
    }
    if (!form.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    if (!form.expiryDate) {
      toast.error("Vui lòng nhập ngày hết hạn");
      return;
    }
    if (!form.frontImage || !form.backImage) {
      toast.error("Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau");
      return;
    }

    try {
      const requestData: IdentifyDocumentRequest = {
        userId: user.userId,
        type: "gplx", // Sử dụng "gplx" thay vì "DRIVING_LICENSE"
        countryCode: form.countryCode,
        numberMasked: form.licenseNumber,
        licenseClass: form.licenseClass,
        expireAt: new Date(form.expiryDate),
        status: "PENDING",
        note: `Họ tên: ${form.fullName}, CCCD: ${form.cccd}, Địa chỉ: ${form.address}, Ngày cấp: ${form.issueDate}`,
      };

      const response = await identifyDocumentAPI.upload(requestData);
      
      // Kiểm tra response success
      if (response.code === "SUCCESS" && response.statusCode === 201) {
        toast.success(response.message || "Đã gửi giấy tờ để xác thực");
        setEdit(false);
        setStatus("pending");
        
        // Reset form sau khi lưu thành công
        setForm({
          licenseNumber: "",
          cccd: "",
          fullName: user?.name ?? "",
          dob: "",
          address: "",
          issueDate: "",
          expiryDate: "",
          licenseClass: "B1",
          countryCode: "VN",
          frontImage: null,
          backImage: null,
        });
      } else {
        toast.error(response.message || "Lưu thất bại, thử lại sau");
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Lưu thất bại, thử lại sau";
      toast.error(errorMessage);
    }
  }

  return (
    <section className="rounded-xl border bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Giấy phép lái xe</h3>
          <StatusPill status={status} />
        </div>

        {!edit ? (
          <Button variant="outline" size="sm" onClick={() => setEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Lưu
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEdit(false);
                setForm({
                  licenseNumber: "",
                  cccd: "",
                  fullName: user?.name ?? "",
                  dob: "",
                  address: "",
                  issueDate: "",
                  expiryDate: "",
                  licenseClass: "B1",
                  countryCode: "VN",
                  frontImage: null,
                  backImage: null,
                });
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
          />
          <ImageUpload
            label="Mặt sau GPLX"
            file={form.backImage}
            onChange={(file) => onChange("backImage", file)}
            disabled={!edit}
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
            label="Số CCCD"
            value={form.cccd}
            onChange={(v) => onChange("cccd", v)}
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
            label="Ngày sinh"
            type="date"
            value={form.dob}
            onChange={(v) => onChange("dob", v)}
            disabled={!edit}
          />
          <Field
            label="Địa chỉ"
            value={form.address}
            onChange={(v) => onChange("address", v)}
            disabled={!edit}
          />
          <Field
            label="Ngày cấp"
            type="date"
            value={form.issueDate}
            onChange={(v) => onChange("issueDate", v)}
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
    unverified: { text: "Chưa xác thực", cls: "bg-slate-100 text-slate-700" },
    pending: { text: "Đang chờ duyệt", cls: "bg-amber-100 text-amber-800" },
    verified: { text: "Đã xác thực", cls: "bg-emerald-100 text-emerald-800" },
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
}: {
  label: string;
  file: File | null;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
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
    if (selectedFile.type.startsWith('image/')) {
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
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="mt-1">
        {file || previewUrl ? (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {file?.name || "Ảnh đã tải lên"}
              </span>
              <div className="flex gap-2">
                {previewUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <img 
                        src={previewUrl} 
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
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt={label}
                className="w-full h-32 object-cover rounded border"
              />
            )}
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className={`mx-auto h-8 w-8 ${isDragOver ? 'text-blue-400' : 'text-gray-400'}`} />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={disabled}
                  className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer ${
                    isDragOver 
                      ? 'text-blue-600' 
                      : 'text-blue-600 hover:text-blue-500'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isDragOver ? 'Thả file vào đây' : 'Tải lên ảnh'}
                </button>
                <input
                  ref={fileInputRef}
                  id={`file-upload-${label}`}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={disabled}
                  style={{ display: 'none' }}
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
