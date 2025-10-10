import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

export default function UserInfo() {
  const { user } = useAuthStore();

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Đăng ký thuê xe</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-slate-600">Tên người thuê *</label>
          <Input value={user?.name ?? ""} readOnly />
        </div>
        <div>
          <label className="text-sm text-slate-600">Số điện thoại *</label>
          <Input value={user?.phoneNumber ?? ""} readOnly />
        </div>
        <div>
          <label className="text-sm text-slate-600">Email *</label>
          <Input value={user?.email ?? ""} readOnly />
        </div>
      </div>
    </section>
  );
}
