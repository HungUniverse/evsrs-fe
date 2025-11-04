import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { UserFullAPI } from "@/apis/user.api";
import type { UserFull } from "@/@types/auth.type";

export default function UserInfo() {
  const { isAuthenticated, user } = useAuthStore();
  const [userFull, setUserFull] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserFull = async () => {
      if (!user?.userId) return;

      setLoading(true);
      try {
        const fullUserData = await UserFullAPI.getById(user.userId);
        setUserFull(fullUserData);
      } catch (error) {
        console.error("Failed to fetch user full data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFull();
  }, [user?.userId]);

  if (!isAuthenticated || !user) {
    return (
      <section className="rounded-xl border bg-white p-6">
        <p className="text-slate-600">Bạn chưa đăng nhập.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>
        <div className="animate-pulse space-y-4">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  console.log("JWT User:", user);
  console.log("Full User:", userFull);

  return (
    <section className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col items-center">
          <img
            src={
              userFull?.profilePicture || user.avatar || "/default-avatar.png"
            }
            alt="avatar"
            className="h-24 w-24 rounded-full ring-1 ring-slate-200 object-cover"
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Họ tên" value={userFull?.fullName} />
          <Field
            label="Tên tài khoản"
            value={userFull?.userName || user.userName}
          />
          <Field label="Email" value={userFull?.userEmail || user.email} />
          <Field
            label="Số điện thoại"
            value={userFull?.phoneNumber || user.phone}
          />
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
