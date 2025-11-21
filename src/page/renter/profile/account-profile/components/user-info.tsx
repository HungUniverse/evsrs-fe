import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { uploadFileToCloudinary } from "@/lib/utils/cloudinary";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { UserFullAPI } from "@/apis/user.api";
import type { UserFull } from "@/@types/auth.type";
import { MembershipAPI } from "@/apis/membership.api";
import type { MyMembershipResponse } from "@/@types/membership";
import { Camera, Crown, Loader2, TrendingUp, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

type AvatarDialogState = "idle" | "preview" | "uploading" | "success";

export default function UserInfo() {
  const { isAuthenticated, user } = useAuthStore();
  const [userFull, setUserFull] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [membership, setMembership] = useState<MyMembershipResponse | null>(
    null
  );
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<AvatarDialogState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetAvatarDialog = () => {
    setDialogState("idle");
    setSelectedFile(null);
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  const handleDialogChange = (open: boolean) => {
    setIsAvatarDialogOpen(open);
    if (!open) {
      resetAvatarDialog();
    } else {
      setDialogState("idle");
      setErrorMessage(null);
    }
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Vui lòng chọn tệp hình ảnh hợp lệ.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Dung lượng tối đa 5MB. Vui lòng chọn ảnh khác.");
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
    setDialogState("preview");
    setErrorMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.userId) return;

    try {
      setDialogState("uploading");
      setErrorMessage(null);
      const uploadedUrl = await uploadFileToCloudinary(selectedFile);
      await UserFullAPI.updateProfilePicture(user.userId, uploadedUrl);
      setUserFull((prev) =>
        prev
          ? {
              ...prev,
              profilePicture: uploadedUrl,
            }
          : prev
      );
      setDialogState("success");
    } catch (err) {
      console.error("Upload avatar failed:", err);
      setErrorMessage(
        "Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau."
      );
      setDialogState("preview");
    }
  };

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
          <button
            type="button"
            onClick={() => handleDialogChange(true)}
            className="group relative h-24 w-24 rounded-full ring-1 ring-slate-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Cập nhật ảnh đại diện"
          >
            {userFull?.profilePicture || user.avatar ? (
              <img
                src={userFull?.profilePicture || user.avatar}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                <User className="w-12 h-12 text-slate-400" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>

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
      <Dialog open={isAvatarDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-md text-center" showCloseButton>
          <DialogHeader>
            <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
          </DialogHeader>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {dialogState === "uploading" && (
            <div className="py-8 flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-600 text-sm">
                Đang cập nhật ảnh của bạn...
              </p>
            </div>
          )}

          {dialogState === "success" && (
            <div className="py-6 flex flex-col items-center gap-4">
              <p className="text-slate-700">
                Cập nhật ảnh đại diện thành công.
              </p>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-500/90 text-white"
                onClick={() => handleDialogChange(false)}
              >
                Hoàn tất
              </Button>
            </div>
          )}

          {dialogState === "preview" && previewUrl && (
            <div className="flex flex-col gap-4">
              <div className="mx-auto w-full max-w-xs rounded-2xl overflow-hidden border">
                <img
                  src={previewUrl}
                  alt="Ảnh xem trước"
                  className="h-64 w-full object-cover"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleChooseImage}
                >
                  Chọn hình khác
                </Button>
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-500/90 text-white"
                  onClick={handleUpload}
                >
                  Cập nhật
                </Button>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
          )}

          {dialogState === "idle" && (
            <div className="py-4 flex flex-col gap-3">
              <Button
                className="mx-auto bg-emerald-500 hover:bg-emerald-500/90 text-white"
                onClick={handleChooseImage}
              >
                Chọn hình
              </Button>
              <p className="text-sm text-slate-500">
                Hỗ trợ định dạng JPG, PNG, GIF với kích thước tối đa 5MB.
              </p>
              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
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
