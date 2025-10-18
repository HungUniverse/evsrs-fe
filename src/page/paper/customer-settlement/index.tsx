import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { orderBookingAPI } from "@/apis/order-booking.api";

import type { OrderBookingDetail } from "@/@types/order/order-booking";

import PartiesSummary from "../hand-over-inspection/components/PartiesSummary";
import CarInfo from "./components/car-info";
import SettlementViewCustomer from "./components/settlement-view";
import type { ReturnSettlement } from "@/@types/order/return-settlement";
import { returnSettlementAPI } from "@/apis/return-settlement.api";

export default function CustomerSettlementPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [settlement, setSettlement] = useState<ReturnSettlement | null>(null);
  const [loading, setLoading] = useState(true);

  const title = useMemo(() => "BIÊN BẢN THANH TOÁN GIAO XE", []);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const [o, s] = await Promise.all([
          orderBookingAPI.getById(orderId),
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

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Chưa có biên bản trả xe.</div>;
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <PartiesSummary order={order} />

      <CarInfo
        car={order.carEvs}
        orderId={orderId}
        startAt={order.startAt}
        endAt={order.endAt}
      />
      {settlement ? (
        <SettlementViewCustomer data={settlement} />
      ) : (
        "Không tìm thấy biên bản thanh toán."
      )}
    </div>
  );
}
