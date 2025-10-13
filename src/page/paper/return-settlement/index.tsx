/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/axios/axios";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type {
  ReturnSettlement,
  ReturnSettlementRequest,
} from "@/@types/order/return-settlement";

import { returnSettlementAPI } from "@/apis/return-settlement.api";
import PartiesSummary from "../hand-over-inspection/components/PartiesSummary";
import CarInfo from "../hand-over-inspection/components/CarInfo";
import SettlementView from "./components/settlement-view";
import SettlementForm from "./components/settlement-form";

function isStaffRole(r?: string | number | null) {
  const s = String(r ?? "")
    .trim()
    .toUpperCase();
  return s === "STAFF";
}

function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function ReturnSettlementPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [settlement, setSettlement] = useState<ReturnSettlement | null>(null);
  const [loading, setLoading] = useState(true);

  const isStaff = isStaffRole(user?.role);
  const hasSettlement = !!settlement;

  const title = useMemo(() => "BIÊN BẢN THANH TOÁN KHI TRẢ XE", []);

  // Load order
  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoadingOrder(true);
      try {
        const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        setOrder(res.data.data);
      } catch {
        toast.error("Không tải được đơn hàng");
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [orderId]);

  // Load settlement
  async function refetchSettlement() {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await returnSettlementAPI.getByOrderId(orderId);
      setSettlement(data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refetchSettlement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleCreate(payload: ReturnSettlementRequest) {
    if (!orderId) return toast.error("Thiếu orderId");
    if (!user?.userId) return toast.error("Thiếu staffId");
    try {
      const body: ReturnSettlementRequest = {
        ...payload,
        orderBookingId: orderId,
      };
      const created = await returnSettlementAPI.create(body);
      setSettlement(created);
      toast.success("Đã tạo biên bản thanh toán");
      // TODO: sau khi tạo có thể hiển thị QR/payment tại đây
    } catch {
      toast.error("Tạo biên bản thất bại");
    }
  }

  if (loadingOrder || loading) {
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

  const defaultSubtotal = String(
    toNum(order.remainingAmount ?? order.totalAmount ?? "0")
  );

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
            {hasSettlement ? "Đã có biên bản" : "Chưa có biên bản"}
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
        {hasSettlement ? (
          <SettlementView data={settlement!} />
        ) : isStaff ? (
          <SettlementForm
            staffDisplay={user?.name || user?.userName || user?.userId || ""}
            defaultSubtotal={defaultSubtotal}
            loading={false}
            onSubmit={handleCreate}
          />
        ) : (
          <div className="text-center text-slate-500">
            Chưa có biên bản thanh toán.
          </div>
        )}
      </div>
    </section>
  );
}
