// src/page/renter/profile/account-profile/components/user-paper.tsx
import { useState } from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X, CheckCircle2, CircleAlert } from "lucide-react";
import { toast } from "sonner";

type PaperStatus = "unverified" | "pending" | "verified";

export default function UserPaper() {
  const { user, isAuthenticated } = useAuthStore();
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState<PaperStatus>("unverified");

  const [form, setForm] = useState({
    licenseNumber: user?.gplx ?? "",
    cccd: user?.cccd ?? "",
    fullName: user?.fullName ?? "",
    dob: user?.dob ?? "",
    address: "",
    issueDate: "",
    expiryDate: "",
    frontAlt: "", // ghi chú/alt mặt trước
    backAlt: "", // ghi chú/alt mặt sau
  });

  if (!isAuthenticated) return null;

  function onChange<K extends keyof typeof form>(key: K, val: string) {
    setForm((s) => ({ ...s, [key]: val }));
  }

  async function onSave() {
    try {
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Đã lưu giấy tờ");
      setEdit(false);
      setStatus("pending");
    } catch {
      toast.error("Lưu thất bại, thử lại sau");
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
                  licenseNumber: user?.gplx ?? "",
                  cccd: user?.cccd ?? "",
                  fullName: user?.fullName ?? "",
                  dob: user?.dob ?? "",
                  address: "",
                  issueDate: "",
                  expiryDate: "",
                  frontAlt: "",
                  backAlt: "",
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
          <Field
            label="Mặt trước (alt/ghi chú)"
            value={form.frontAlt}
            onChange={(v) => onChange("frontAlt", v)}
            disabled={!edit}
          />
          <Field
            label="Mặt sau (alt/ghi chú)"
            value={form.backAlt}
            onChange={(v) => onChange("backAlt", v)}
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
            label="Số CCCD"
            value={form.cccd}
            onChange={(v) => onChange("cccd", v)}
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
