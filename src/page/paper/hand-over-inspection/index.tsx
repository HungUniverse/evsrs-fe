/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { api } from "@/lib/axios/axios";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { ItemBaseResponse } from "@/@types/response";

import type { HandoverInspectionType } from "@/@types/enum";

import PartiesSummary from "./components/PartiesSummary";
import CarInfo from "./components/CarInfo";
import InspectionView from "./components/InspectionView";

import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type {
  HandoverInspection,
  HandoverInspectionRequest,
} from "@/@types/order/handover-inspection";
import UploadHandover from "./components/upload-handover";

function isStaffRole(r?: string | number | null) {
  const s = String(r ?? "")
    .trim()
    .toUpperCase();
  return s === "STAFF";
}
function isUserRole(r?: string | number | null) {
  const s = String(r ?? "")
    .trim()
    .toUpperCase();
  return s === "USER";
}

export default function HandoverInspectionPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [inspection, setInspection] = useState<HandoverInspection | null>(null);
  const [checking, setChecking] = useState(true);

  const [odometer, setOdometer] = useState<string>("0");
  const [batteryPercent, setBatteryPercent] = useState<string>("90");
  const [notes, setNotes] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string>("");

  const isStaff = isStaffRole(user?.role);
  const isUser = isUserRole(user?.role);

  const hasInspection = inspection !== null;
  const showForm = isStaff && !hasInspection;
  const showNoPermission = !isStaff && !hasInspection;

  const [checkingOut, setCheckingOut] = useState(false);
  const [starting, setStarting] = useState(false);

  // Load order
  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        setOrder(res.data.data);
      } catch {
        toast.error("Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  async function refetchInspection() {
    if (!orderId) return;
    setChecking(true);
    try {
      const result = await handoverInspectionAPI.getByOrderId(orderId);
      if (Array.isArray(result)) {
        const list = [...result].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setInspection(list[0] ?? null);
      } else {
        setInspection(result ?? null);
      }
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    refetchInspection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const title = useMemo(() => "BIÊN BẢN BÀN GIAO XE Ô TÔ", []);

  async function handleConfirm() {
    if (!orderId || !user?.userId) return toast.error("Thiếu dữ liệu");

    const body: HandoverInspectionRequest = {
      orderBookingId: orderId,
      type: "HANDOVER",
      batteryPercent: batteryPercent,
      odometer: odometer,
      images: imageUrls,
      notes,
      staffId: user.userId,
    };

    try {
      const created = await handoverInspectionAPI.create(body);
      setInspection(created);
      toast.success("Đã lập biên bản bàn giao");
    } catch {
      toast.error("Lập biên bản thất bại");
    }
  }

  if (loading || checking) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-gray-600">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  const canCheckout =
    isStaff && hasInspection && order?.status !== "CHECKED_OUT";

  async function handleCheckout() {
    if (!orderId) return;
    if (!inspection) {
      toast.error("Vui lòng lập biên bản bàn giao trước khi Checkout.");
      return;
    }
    try {
      setCheckingOut(true);
      const updated = await orderBookingAPI.checkout(orderId);
      setOrder(updated);
      toast.success("Checkout thành công");
    } catch {
      toast.error("Checkout thất bại");
    } finally {
      setCheckingOut(false);
    }
  }

  const canStart = isUser && order?.status === "CHECKED_OUT";
  async function handleStart() {
    if (!orderId) return;
    try {
      setStarting(true);
      const updated = await orderBookingAPI.start(orderId);
      setOrder(updated);
      toast.success("Bắt đầu chuyến thuê");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Start thất bại");
    } finally {
      setStarting(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-xl font-bold uppercase">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </h1>
          <h2 className="text-xl font-bold uppercase">
            Độc lập – Tự do – Hạnh phúc
          </h2>
          <div className="text-lg">---------------------------------</div>
          <h3 className="text-2xl font-bold uppercase text-gray-800">
            {title}
          </h3>
          <div className="text-sm text-slate-500">
            {hasInspection ? "Đã lập biên bản" : "Chưa có biên bản"}
          </div>
        </div>

        <PartiesSummary order={order} />

        <CarInfo
          licensePlate={order.carEvs.licensePlate}
          startAt={order.startAt}
          endAt={order.endAt}
          carName={order.carEvs.model?.modelName ?? undefined}
        />

        {hasInspection && <InspectionView inspection={inspection!} />}

        {showForm && (
          <div className="rounded-lg border p-4 space-y-4">
            <div className="font-semibold">Ghi nhận hiện trạng</div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odo">Odometer (km)</Label>
                <Input
                  id="odo"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="Ví dụ: 12345"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bat">Battery (%)</Label>
                <Input
                  id="bat"
                  value={batteryPercent}
                  onChange={(e) => setBatteryPercent(e.target.value)}
                  placeholder=">= 80"
                  inputMode="numeric"
                />
                <p className="text-xs text-slate-500">Khuyến nghị &gt;= 80%</p>
              </div>
              <div className="space-y-2">
                <Label>Nhân viên thực hiện</Label>
                <Input
                  value={user?.name || user?.userName || user?.userId || ""}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tình trạng xe, vết xước, phụ kiện đi kèm..."
              />
            </div>
            <UploadHandover
              label="Ảnh/biên bản hiện trạng"
              value={imageUrls}
              onChange={setImageUrls}
            />
            <div className="flex justify-end">
              <Button onClick={handleConfirm}>Xác nhận lập biên bản</Button>
            </div>
          </div>
        )}

        {showNoPermission && (
          <div className="text-center text-slate-500">
            Bạn không có quyền lập biên bản.
          </div>
        )}
        <div className="flex justify-end gap-3">
          {isStaff && (
            <Button
              onClick={handleCheckout}
              disabled={!canCheckout || checkingOut}
              title={!canCheckout ? "Cần có biên bản/hoặc đã checkout" : ""}
            >
              {checkingOut ? "Đang checkout..." : "Checkout"}
            </Button>
          )}

          {canStart && (
            <Button
              onClick={handleStart}
              disabled={starting}
              variant="secondary"
              title="Bắt đầu sử dụng xe (IN_USE)"
            >
              {starting ? "Đang bắt đầu..." : "Xác nhận sử dụng xe"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
