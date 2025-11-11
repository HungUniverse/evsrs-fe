import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { UserFullAPI } from "@/apis/user.api";
import type { UserFull } from "@/@types/auth.type";
import { MembershipAPI } from "@/apis/membership.api";
import type { MyMembershipResponse } from "@/@types/membership";
import { Crown, TrendingUp, User } from "lucide-react";

const MEMBERSHIP_COLORS = {
  NONE: "bg-gray-100 text-gray-700 border-gray-300",
  BRONZE: "bg-amber-100 text-amber-700 border-amber-300",
  SILVER: "bg-slate-100 text-slate-700 border-slate-400",
  GOLD: "bg-yellow-100 text-yellow-700 border-yellow-400",
};

const MEMBERSHIP_LABELS = {
  NONE: "None",
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
};

export default function UserInfo() {
  const { isAuthenticated, user } = useAuthStore();
  const [userFull, setUserFull] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [membership, setMembership] = useState<MyMembershipResponse | null>(
    null
  );

  useEffect(() => {
    const fetchUserFull = async () => {
      if (!user?.userId) return;

      setLoading(true);
      try {
        const fullUserData = await UserFullAPI.getById(user.userId);
        setUserFull(fullUserData);

        // Fetch membership data
        try {
          const myMemberShip = await MembershipAPI.getMyMembership();
          setMembership(myMemberShip);
        } catch (error) {
          console.error("Failed to fetch membership:", error);
          // Keep membership as null if API fails
        }
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

  return (
    <section className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin tài khoản</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col items-center space-y-3">
          {userFull?.profilePicture || user.avatar ? (
            <img
              src={userFull?.profilePicture || user.avatar}
              alt="avatar"
              className="h-24 w-24 rounded-full ring-1 ring-slate-200 object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full ring-1 ring-slate-200 bg-slate-100 flex items-center justify-center">
              <User className="w-12 h-12 text-slate-400" />
            </div>
          )}

          {/* Membership Badge */}
          <MembershipBadge membership={membership} />
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

      {/* Membership Progress */}
      {membership && membership.level !== "NONE" && (
        <div className="mt-6 pt-6 border-t">
          <MembershipProgress membership={membership} />
        </div>
      )}
    </section>
  );
}

function MembershipBadge({
  membership,
}: {
  membership: MyMembershipResponse | null;
}) {
  const level = membership?.level?.toUpperCase() || "NONE";
  const colorClass =
    MEMBERSHIP_COLORS[level as keyof typeof MEMBERSHIP_COLORS] ||
    MEMBERSHIP_COLORS.NONE;
  const label =
    membership?.levelName ||
    MEMBERSHIP_LABELS[level as keyof typeof MEMBERSHIP_LABELS] ||
    "None";
  const discount = membership?.discountPercent || 0;

  return (
    <div
      className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${colorClass}`}
    >
      <Crown className="w-4 h-4" />
      <div className="text-sm font-semibold">
        {label}
        {discount > 0 && <span className="ml-1">(Giảm {discount}%)</span>}
      </div>
    </div>
  );
}

function MembershipProgress({
  membership,
}: {
  membership: MyMembershipResponse;
}) {
  const progress = Math.min(100, membership.progressToNextLevel || 0);
  const hasNextLevel = membership.nextLevelName !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Tiến độ thành viên</span>
        </div>
        {hasNextLevel && (
          <span className="text-gray-600">
            Còn {membership.amountToNextLevel?.toLocaleString("vi-VN")}đ để lên{" "}
            {membership.nextLevelName}
          </span>
        )}
      </div>

      {hasNextLevel ? (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              Tổng chi: {membership.totalOrderBill?.toLocaleString("vi-VN")}đ
            </span>
            <span>{progress.toFixed(1)}%</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
          🎉 Bạn đã đạt cấp độ cao nhất! Tổng chi:{" "}
          {membership.totalOrderBill?.toLocaleString("vi-VN")}đ
        </div>
      )}
    </div>
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
