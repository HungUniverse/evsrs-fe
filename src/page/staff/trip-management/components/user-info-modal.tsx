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
import type { UserFull } from "@/@types/auth.type";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
};

export default function UserInfoModal({ open, onOpenChange, userId }: Props) {
  const [user, setUser] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!open || !userId) return;
      setLoading(true);
      setErr(null);
      try {
        const u = await UserFullAPI.getById(userId);
        if (!ignore) setUser(u);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (!ignore) setErr(e?.message || "Lỗi tải thông tin người dùng");
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
      <DialogContent className="max-w-xl p-0 overflow-hidden">
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
              {/* Header */}
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

              {/* Account info */}
              <section className="border rounded-xl p-4 grid grid-cols-2 gap-4">
                <Info label="Username" value={user.userName} />
                <Info label="Email" value={user.userEmail} />
                <Info label="Phone" value={user.phoneNumber || undefined} />
                <Info
                  label="Date of birth"
                  value={user.dateOfBirth || undefined}
                />
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
      <p className="font-medium">{value ?? "—"}</p>
    </div>
  );
}
