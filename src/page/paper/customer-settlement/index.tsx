import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { api } from "@/lib/axios/axios";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type {
  HandoverInspection,
  ReturnInspection,
} from "@/@types/order/return-inspection";

import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";

import PartiesSummary from "../hand-over-inspection/components/PartiesSummary";
import CarInfo from "./components/car-info";
import SettlementView from "./components/settlement-view";
import SettlementForm from "./components/settlement-form";

export default function CustomerSettlementPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [handoverInspection, setHandoverInspection] =
    useState<HandoverInspection | null>(null);
  const [returnInspection, setReturnInspection] =
    useState<ReturnInspection | null>(null);
  const [loading, setLoading] = useState(true);

  const title = useMemo(() => "BIÊN BẢN THANH TOÁN GIAO XE", []);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const [orderRes, handoverInspect, returnInspect] = await Promise.all([
          api.get<ItemBaseResponse<OrderBookingDetail>>(
            `/api/OrderBooking/${orderId}`
          ),
          handoverInspectionAPI.getByOrderId(orderId),
          returnInspectionAPI.getByOrderId(orderId),
        ]);

        console.log("Handover Inspection:", handoverInspect);
        console.log("Return Inspection:", returnInspect);

        setOrder(orderRes.data.data);
        setHandoverInspection(handoverInspect);
        setReturnInspection(returnInspect);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin thanh toán");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (!order || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <PartiesSummary order={order} />

      <CarInfo
        car={order.carEvs}
        handoverInspection={handoverInspection}
        returnInspection={returnInspection}
        startAt={order.startAt}
        endAt={order.endAt}
      />

      {handoverInspection ? (
        <SettlementView inspection={handoverInspection} order={order} />
      ) : (
        <SettlementForm
          staffDisplay={user?.userName ?? ""}
          order={order}
          onSubmit={async (inspection) => {
            setHandoverInspection(inspection);
            toast.success("Đã lưu thông tin thanh toán");
          }}
        />
      )}
    </div>
  );
}
