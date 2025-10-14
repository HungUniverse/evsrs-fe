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

function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function ReturnSettlementPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [settlement, setSettlement] = useState<ReturnSettlement | null>(null);
  const [loading, setLoading] = useState(true);

  const title = useMemo(() => "BIÊN BẢN THANH TOÁN KHI TRẢ XE", []);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const [o, s] = await Promise.all([
          api.get<ItemBaseResponse<OrderBookingDetail>>(
            `/api/OrderBooking/${orderId}`
          ),
          returnSettlementAPI.getByOrderId(orderId),
        ]);

        setOrder(o.data.data);
        setSettlement(s);
      } catch {
        toast.error("Không tải được dữ liệu thanh toán");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  async function handleCreate(body: ReturnSettlementRequest) {
    if (!orderId) {
      toast.error("Thiếu orderId");
      return;
    }
    try {
      const payload: ReturnSettlementRequest = {
        ...body,
        orderBookingId: orderId,
      };
      const created = await returnSettlementAPI.create(payload);
      setSettlement(created);
      toast.success("Đã tạo biên bản thanh toán");
    } catch {
      toast.error("Tạo biên bản thất bại");
    }
  }

  if (loading) {
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
            {settlement ? "Đã có biên bản" : "Chưa có biên bản"}
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
        {settlement ? (
          <SettlementView data={settlement} />
        ) : (
          <SettlementForm
            staffDisplay={user?.name || user?.userName || user?.userId || ""}
            defaultSubtotal={defaultSubtotal}
            loading={false}
            onSubmit={handleCreate}
          />
        )}
      </div>
    </section>
  );
}
