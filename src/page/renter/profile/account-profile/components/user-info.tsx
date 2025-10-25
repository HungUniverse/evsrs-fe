import { useAuthStore } from "@/lib/zustand/use-auth-store";

export default function UserInfo() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <section className="rounded-xl border bg-white p-6">
        <p className="text-slate-600">Bạn chưa đăng nhập.</p>
      </section>
    );
  }
  console.log(user);

  return (
    <section className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt="avatar"
            className="h-24 w-24 rounded-full ring-1 ring-slate-200 object-cover"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" value={user.email} />
          <Field label="Số điện thoại" value={user.phone} />
          <Field label="Ngày sinh" value={user?.phone || ""} />
          <Field label="Giới tính" value={user.phone || "Nam"} />
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="h-10 px-3 rounded-md bg-slate-50 border text-sm flex items-center">
        {value || "—"}
      </div>
    </div>
  );
}
