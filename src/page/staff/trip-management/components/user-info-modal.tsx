import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { UserFullAPI } from "@/apis/user.api";
import { identifyDocumentAPI } from "@/apis/identify-document.api";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { fmtDateTime } from "@/hooks/fmt-date-time";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
};

export default function UserInfoModal({ open, onOpenChange, userId }: Props) {
  const [user, setUser] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // chỉ 1 GPLX
  const [gplx, setGplx] = useState<IdentifyDocumentResponse | null>(null);
  const [docErr, setDocErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!open || !userId) return;
      setLoading(true);
      setErr(null);
      setDocErr(null);
      try {
        const [u, d] = await Promise.all([
          UserFullAPI.getById(userId),
          identifyDocumentAPI.getUserDocuments(userId),
        ]);
        if (!ignore) {
          setUser(u);
          setGplx(d.data ?? null); // lấy .data
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!ignore) {
          if (!user) setErr(e?.message || "Lỗi tải thông tin người dùng");
          setDocErr("Không lấy được giấy tờ định danh");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[70vh]">
          {loading && (
            <div className="p-6 text-sm text-slate-500">Đang tải…</div>
          )}
          {err && !loading && (
            <div className="p-6 text-sm text-red-600">{err}</div>
          )}

          {!loading && !err && user && (
            <div className="space-y-4">
              <section className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  {user.fullName?.[0] ?? user.userName?.[0] ?? "U"}
                </div>
                <div>
                  <div className="font-semibold">
                    {user.fullName || user.userName}
                  </div>
                  <div className="text-sm text-slate-500">
                    Role: {user.role}
                  </div>
                  <div className="mt-1">
                    <Badge variant={user.isVerify ? "default" : "secondary"}>
                      {user.isVerify ? "Đã xác minh" : "Chưa xác minh"}
                    </Badge>
                  </div>
                </div>
              </section>

              <section className="border rounded-xl p-4 grid grid-cols-2 gap-4">
                <Info label="Username" value={user.userName} />
                <Info label="Email" value={user.userEmail} />
                <Info label="Phone" value={user.phoneNumber || undefined} />
                <Info
                  label="Date of birth"
                  value={user.dateOfBirth || undefined}
                />
              </section>

              {/* GPLX */}
              <section className="border rounded-xl p-4 space-y-4">
                <div className="font-semibold">Giấy phép lái xe</div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Thông tin GPLX</div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mt-3">
                    <Info
                      label="Số GPLX"
                      value={gplx?.numberMasked || undefined}
                    />
                    <Info
                      label="Hạng"
                      value={gplx?.licenseClass || undefined}
                    />
                    <Info
                      label="Hết hạn"
                      value={fmtDateTime(gplx?.expireAt ?? "-")}
                    />
                  </div>

                  <DocImages front={gplx?.frontImage} back={gplx?.backImage} />
                </div>

                {docErr && <p className="text-sm text-amber-600">{docErr}</p>}
              </section>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium break-all">{value ?? "—"}</p>
    </div>
  );
}

function DocImages({
  front,
  back,
}: {
  front?: string | null;
  back?: string | null;
}) {
  const f = toImg(front);
  const b = toImg(back);
  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      <Thumb label="Mặt trước" src={f} />
      <Thumb label="Mặt sau" src={b} />
    </div>
  );
}

function Thumb({ label, src }: { label: string; src: string | null }) {
  return (
    <div className="border rounded-md p-2">
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      {src ? (
        <a href={src} target="_blank" rel="noreferrer">
          <img
            src={src}
            alt={label}
            className="w-full h-32 object-cover rounded"
          />
        </a>
      ) : (
        <div className="w-full h-32 bg-slate-100 rounded grid place-items-center text-xs text-slate-400">
          Chưa có ảnh
        </div>
      )}
    </div>
  );
}

function toImg(u?: string | null): string | null {
  if (!u) return null;
  if (/^https?:\/\//i.test(u) || u.startsWith("data:image")) return u;
  const base = import.meta.env.VITE_API_URL || "";
  return `${base}${u.startsWith("/") ? "" : "/"}${u}`;
}
