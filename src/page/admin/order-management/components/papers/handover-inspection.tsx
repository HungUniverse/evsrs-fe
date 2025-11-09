import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/axios/axios";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { ItemBaseResponse } from "@/@types/response";
import type { HandoverInspection } from "@/@types/order/handover-inspection";
import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import PartiesSummary from "@/page/paper/hand-over-inspection/components/PartiesSummary";
import CarInfo from "@/page/paper/hand-over-inspection/components/CarInfo";
import InspectionView from "@/page/paper/hand-over-inspection/components/InspectionView";

export default function AdminHandoverInspectionPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState<HandoverInspection | null>(null);
  const [checking, setChecking] = useState(true);

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
        // Handle error silently for admin
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setChecking(true);
      try {
        const result = await handoverInspectionAPI.getByOrderId(orderId);
        setInspection(result);
      } finally {
        setChecking(false);
      }
    })();
  }, [orderId]);

  const title = useMemo(() => "BIÊN BẢN BÀN GIAO XE Ô TÔ", []);

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
            {inspection ? "Đã lập biên bản" : "Chưa có biên bản"}
          </div>
        </div>

        <PartiesSummary order={order} />

        <CarInfo
          licensePlate={order.carEvs.licensePlate}
          startAt={order.startAt}
          endAt={order.endAt}
          carName={order.carEvs.model?.modelName ?? undefined}
        />

        {inspection ? (
          <InspectionView inspection={inspection} />
        ) : (
          <div className="text-center text-slate-500 py-8">
            Chưa có biên bản bàn giao xe
          </div>
        )}
      </div>
    </section>
  );
}

