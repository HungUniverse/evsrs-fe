import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUsers } from "@/mockdata/mock-user";
import type { User } from "@/@types/customer";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null; // có thể dùng cho lessor hoặc lessee
};

export default function UserInfoModal({ open, onOpenChange, userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    // tìm user trong mockUsers theo cccd (vì userId từ Contract.lesseeIdNumber)
    const found = mockUsers.find((u) => u.cccd === userId);

    // giả lập delay tải dữ liệu
    setTimeout(() => {
      setUser(found || null);
      setLoading(false);
    }, 400);
  }, [userId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw] h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(80vh-64px)] p-6">
          {loading && (
            <div className="text-center text-slate-500">
              Đang tải thông tin...
            </div>
          )}

          {!loading && !user && (
            <div className="text-center text-slate-500">
              Không tìm thấy người dùng tương ứng.
            </div>
          )}

          {!loading && user && (
            <div className="space-y-6">
              {/* Avatar + thông tin cơ bản */}
              <section className="flex items-center gap-4">
                <img
                  src={user.profilePicture}
                  alt={user.fullName}
                  className="w-24 h-24 rounded-full border object-cover"
                />
                <div>
                  <div className="text-lg font-semibold">{user.fullName}</div>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-sm text-slate-600">{user.phoneNumber}</p>
                  <p className="text-sm text-slate-600">
                    Ngày sinh: {user.dob}
                  </p>
                </div>
              </section>

              {/* CCCD */}
              <section className="border rounded-xl p-4 space-y-3">
                <div className="font-medium text-slate-700">
                  Căn cước công dân
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Info label="Số CCCD" value={user.cccd} />
                  <Info label="Ngày cấp" value="2020-08-12" />
                  <Info label="Nơi cấp" value="Công an TP.HCM" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <ImageBox src="/mock/cccd_front.jpg" label="Mặt trước" />
                  <ImageBox src="/mock/cccd_back.jpg" label="Mặt sau" />
                </div>
              </section>

              {/* GPLX */}
              <section className="border rounded-xl p-4 space-y-3">
                <div className="font-medium text-slate-700">
                  Giấy phép lái xe
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Info label="Số GPLX" value={user.gplx} />
                  <Info label="Hạng" value="B2" />
                  <Info label="Ngày hết hạn" value="2030-01-01" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <ImageBox src="/mock/gplx_front.jpg" label="Mặt trước" />
                  <ImageBox src="/mock/gplx_back.jpg" label="Mặt sau" />
                </div>
              </section>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

/* Sub Components */
function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

function ImageBox({ src, label }: { src?: string; label: string }) {
  if (!src)
    return (
      <div className="border rounded-lg h-40 flex items-center justify-center text-slate-400 text-sm">
        {label} (Chưa có ảnh)
      </div>
    );
  return (
    <div className="flex flex-col gap-1">
      <img
        src={src}
        alt={label}
        className="rounded-lg border h-40 object-cover"
      />
      <span className="text-xs text-center text-slate-500">{label}</span>
    </div>
  );
}
