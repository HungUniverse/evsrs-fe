/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/axios/axios";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type {
  HandoverInspection,
  ReturnInspection,
  ReturnInspectionRequest,
} from "@/@types/order/inspection";

import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";
import { orderBookingAPI } from "@/apis/order-booking.api";

import PartiesSummary from "../hand-over-inspection/components/PartiesSummary";
import CarInfo from "../hand-over-inspection/components/CarInfo";
import ReturnForm from "./components/return-form";
import ReturnView from "./components/return-view";

function isStaffRole(r?: string | number | null) {
  const s = String(r ?? "")
    .trim()
    .toUpperCase();
  return s === "STAFF";
}

export default function ReturnInspectionPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [handover, setHandover] = useState<HandoverInspection | null>(null);
  const [ret, setRet] = useState<ReturnInspection | null>(null);

  const [initLoading, setInitLoading] = useState(true);
  const [confirmingReturn, setConfirmingReturn] = useState(false);

  const isStaff = isStaffRole(user?.role);
  const status = order?.status;
  const hasReturn = !!ret;

  const canFinishReturn = isStaff && status === "RETURNED";
  const canConfirmReturn = isStaff && hasReturn && status === "IN_USE";

  // Debug logs
  console.log("Current state:", { isStaff, status, hasReturn, canFinishReturn, canConfirmReturn });

  const title = useMemo(() => "BIÊN BẢN TRẢ XE Ô TÔ", []);

  async function refetchOrder() {
    if (!orderId) return;
    const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
      `/api/OrderBooking/${orderId}`
    );
    console.log("Order fetched:", res.data.data);
    console.log("Order status:", res.data.data?.status);
    setOrder(res.data.data);
  }

  async function refetchReturn() {
    if (!orderId) return;
    try {
      const latest = await returnInspectionAPI.getByOrderId(orderId);
      setRet(latest);
    } catch {
      // Giữ nguyên state hiện tại để UI không nhảy về form một cách khó chịu
    }
  }

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setInitLoading(true);
      try {
        // Fetch order
        const orderRes = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        console.log("Order fetched:", orderRes.data.data);
        console.log("Order status:", orderRes.data.data?.status);
        setOrder(orderRes.data.data);

        // Fetch handover
        const handoverData: any = await handoverInspectionAPI.getByOrderId(orderId);
        if (Array.isArray(handoverData)) {
          handoverData.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
          setHandover(handoverData[0] ?? null);
        } else {
          setHandover(handoverData ?? null);
        }

        // Fetch return inspection
        try {
          const latest = await returnInspectionAPI.getByOrderId(orderId);
          setRet(latest);
        } catch {
          // Giữ nguyên state hiện tại để UI không nhảy về form một cách khó chịu
        }
      } catch {
        toast.error("Không tải được dữ liệu biên bản trả xe");
      } finally {
        setInitLoading(false);
      }
    })();
  }, [orderId]);

  async function handleCreateReturn(v: {
    odometer: string;
    batteryPercent: string;
    notes: string;
  }) {
    if (!orderId || !user?.userId) return toast.error("Thiếu dữ liệu");
    const body: ReturnInspectionRequest = {
      orderBookingId: orderId,
      type: "RETURN",
      images: "",
      staffId: user.userId,
      ...v,
    };
    try {
      const created = await returnInspectionAPI.create(body);
      setRet(created); // dùng ngay object mới
      toast.success("Đã lập biên bản trả xe");
    } catch {
      toast.error("Lập biên bản trả thất bại");
    }
  }

  /** Xác nhận trả xe (đổi status -> RETURNED) */
  async function handleConfirmReturn() {
    if (!orderId) return;
    try {
      setConfirmingReturn(true);
      await orderBookingAPI.return(orderId);
      // refetch để đồng bộ ngay status & biên bản
      await Promise.all([refetchOrder(), refetchReturn()]);
      toast.success("Đã xác nhận trả xe");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Xác nhận trả xe thất bại"
      );
    } finally {
      setConfirmingReturn(false);
    }
  }

  /** Điều hướng sang trang quyết toán */
  function handleGoToSettlement() {
    if (!orderId) return;
    navigate(`/staff/trip/${orderId}/return/settlement`);
  }

  /** ---- Render ---- */
  if (initLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
            {hasReturn ? "Đã lập biên bản" : "Chưa có biên bản"}
          </div>
        </div>

        {/* Parties + Car */}
        <PartiesSummary order={order} />
        <CarInfo
          platePlaceholder="—"
          startAt={order.startAt}
          endAt={order.endAt}
          carName={order.carEvs.model?.modelName ?? undefined}
        />

        {/* View or Form */}
        {hasReturn ? (
          <>
            <ReturnView
              inspection={ret!}
              baseline={handover}
              canConfirmReturn={canConfirmReturn}
              confirming={confirmingReturn}
              onConfirmReturn={handleConfirmReturn}
            />

            {canFinishReturn && (
              <div className="flex justify-end mt-4">
                <Button onClick={handleGoToSettlement}>
                  Hoàn thành biên bản trả xe
                </Button>
              </div>
            )}
          </>
        ) : canFinishReturn ? (
          // Order is already RETURNED, show settlement button
          <div className="text-center space-y-4">
            
            <div className="flex justify-center">
              <Button onClick={handleGoToSettlement}>
                Chuyển hướng qua settlement
              </Button>
            </div>
          </div>
        ) : isStaff ? (
          <ReturnForm
            staffDisplay={user?.name || user?.userName || user?.userId || ""}
            defaultBattery="60"
            loading={false}
            onSubmit={handleCreateReturn}
          />
        ) : (
          <div className="text-center text-slate-500">
            Chưa có biên bản trả xe.
          </div>
        )}
      </div>
    </section>
  );
}
