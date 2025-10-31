import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type {
  ReturnSettlement,
  ReturnSettlementRequest,
} from "@/@types/order/return-settlement";

import { orderBookingAPI } from "@/apis/order-booking.api";
import { returnSettlementAPI } from "@/apis/return-settlement.api";

import PartiesSummary from "../hand-over-inspection/components/PartiesSummary";
import SettlementView from "./components/settlement-view";
import SettlementForm from "./components/settlement-form";
import CarInfo from "../customer-settlement/components/car-info";
import InspectionImages from "./components/inspection-image";

export default function ReturnSettlementPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  // ---- STATE
  const [order, setOrder] = useState<OrderBookingDetail>();
  const [settlement, setSettlement] = useState<ReturnSettlement | null>(null);

  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingSettlement, setLoadingSettlement] = useState(true);
  const [creating, setCreating] = useState(false);

  const [errorOrder, setErrorOrder] = useState<string | null>(null);
  const [errorSettlement, setErrorSettlement] = useState<string | null>(null);

  // ---- MEMO
  const title = useMemo(() => "BIÊN BẢN THANH TOÁN KHI TRẢ XE", []);
  const loading = loadingOrder || loadingSettlement;

  // ---- FETCHERS (tách riêng)
  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoadingOrder(true);
      setErrorOrder(null);
      const res = await orderBookingAPI.getById(orderId);
      // Tùy backend, lấy đúng path data
      const data: OrderBookingDetail =
        (res?.data?.data as OrderBookingDetail) ?? res?.data;
      setOrder(data);
      if (!data) {
        toast.warning("Không tìm thấy đơn hàng.");
      }
    } catch (err) {
      console.error("Fetch order error:", err);
      setErrorOrder("Không tải được dữ liệu đơn hàng.");
      toast.error("Tải đơn hàng thất bại.");
    } finally {
      setLoadingOrder(false);
    }
  }, [orderId]);

  const fetchSettlement = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoadingSettlement(true);
      setErrorSettlement(null);
      const res = await returnSettlementAPI.getByOrderId(orderId);
      const data: ReturnSettlement = res as ReturnSettlement;
      setSettlement(data ?? null);
    } catch (err) {
      console.error("Fetch settlement error:", err);
    } finally {
      setLoadingSettlement(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      toast.error("Thiếu orderId trên URL.");
      return;
    }
    fetchOrder();
    fetchSettlement();
  }, [orderId, fetchOrder, fetchSettlement]);

  const createSettlement = useCallback(
    async (payload: ReturnSettlementRequest) => {
      if (!orderId) {
        toast.error("Thiếu orderId để tạo biên bản.");
        return;
      }
      try {
        setCreating(true);
        const body = { ...payload, orderBookingId: orderId };
        const res = await returnSettlementAPI.create(body);
        const data = res as ReturnSettlement;
        setSettlement(data);
        toast.success("Tạo biên bản thanh toán thành công.");
      } catch (err) {
        console.error("Create settlement error:", err);
        toast.error("Tạo biên bản thanh toán thất bại.");
      } finally {
        setCreating(false);
      }
    },
    [orderId]
  );

  const handleCreate = useCallback(
    async (payload: ReturnSettlementRequest) => {
      await createSettlement(payload);
    },
    [createSettlement]
  );
  const batteryHealthPercentage =
    Number(order?.carEvs?.batteryHealthPercentage) / 100;
  // ---- UI
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

        {/* Thông báo lỗi nhẹ nhàng từng phần */}
        {!!errorOrder && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-700">
            {errorOrder} — Bạn vẫn có thể tạo biên bản thủ công.
          </div>
        )}
        {!!errorSettlement && (
          <div className="rounded-md border border-sky-300 bg-sky-50 p-3 text-sky-700">
            {errorSettlement} — Nếu chưa có biên bản, hãy tạo mới.
          </div>
        )}

        {order ? (
          <>
            <PartiesSummary order={order} />
            <CarInfo
              car={order.carEvs}
              orderId={order.id}
              startAt={order.startAt}
              endAt={order.endAt}
            />
          </>
        ) : (
          <div className="p-4 text-sm text-gray-600">
            Không tìm thấy dữ liệu đơn hàng
          </div>
        )}
        <InspectionImages />
        {settlement ? (
          <div>
            <SettlementView data={settlement} />
          </div>
        ) : (
          <SettlementForm
            staffDisplay={user?.name || user?.userName || user?.userId || ""}
            limitDailyKm={
              order?.carEvs?.model?.limiteDailyKm ??
              order?.carEvs?.model?.limiteDailyKm ??
              order?.carEvs.model?.limiteDailyKm ??
              0
            }
            overageFee={Number(order?.carEvs.model.overageFee)}
            startAt={order?.startAt ?? null}
            endAt={order?.endAt ?? null}
            batteryCapacityKwh={order?.carEvs?.model?.batteryCapacityKwh}
            batteryHealthPercentage={batteryHealthPercentage}
            electricityFee={order?.carEvs?.model?.electricityFee}
            loading={creating}
            onSubmit={handleCreate}
          />
        )}
      </div>
    </section>
  );
}
