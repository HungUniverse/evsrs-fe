import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { ReturnSettlement } from "@/@types/order/return-settlement";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { returnSettlementAPI } from "@/apis/return-settlement.api";
import PartiesSummary from "@/page/paper/hand-over-inspection/components/PartiesSummary";
import SettlementView from "@/page/paper/return-settlement/components/settlement-view";
import CarInfo from "@/page/paper/customer-settlement/components/car-info";
import InspectionImagesByOrder from "@/page/paper/return-settlement/components/inspection-image";

export default function AdminReturnSettlementPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [settlement, setSettlement] = useState<ReturnSettlement | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingSettlement, setLoadingSettlement] = useState(true);

  const title = useMemo(() => "BIÊN BẢN THANH TOÁN KHI TRẢ XE", []);
  const loading = loadingOrder || loadingSettlement;

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      try {
        setLoadingOrder(true);
        const res = await orderBookingAPI.getById(orderId);
        const data: OrderBookingDetail =
          (res?.data?.data as OrderBookingDetail) ?? res?.data;
        setOrder(data);
      } catch {
        // Handle error silently for admin
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      try {
        setLoadingSettlement(true);
        const res = await returnSettlementAPI.getByOrderId(orderId);
        const data: ReturnSettlement = res as ReturnSettlement;
        setSettlement(data ?? null);
      } catch {
        // Handle error silently
      } finally {
        setLoadingSettlement(false);
      }
    })();
  }, [orderId]);

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

        {order ? (
          <>
            <PartiesSummary order={order} />
            <CarInfo
              car={order.carEvs}
              orderId={order.id}
              startAt={order.startAt}
              endAt={order.endAt}
            />
            <InspectionImagesByOrder
              showHandover={true}
              showReturn={true}
              sideBySide={true}
            />
            {settlement ? (
              <SettlementView data={settlement} />
            ) : (
              <div className="text-center text-slate-500 py-8">
                Chưa có biên bản thanh toán
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-sm text-gray-600">
            Không tìm thấy dữ liệu đơn hàng
          </div>
        )}
      </div>
    </section>
  );
}

