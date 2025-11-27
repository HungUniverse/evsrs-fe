import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type {
  ReturnInspectionResponse,
} from "@/@types/order/return-inspection";
import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";
import PartiesSummary from "@/page/paper/hand-over-inspection/components/PartiesSummary";
import type { HandoverInspection } from "@/@types/order/handover-inspection";
import { splitUrls } from "@/hooks/split-url";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Row({
  label,
  before,
  after,
}: {
  label: string;
  before?: string | null;
  after?: string | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 items-center py-2 border-b last:border-b-0">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-sm font-medium break-all">{before ?? "—"}</div>
      <div className="text-sm font-medium break-all">{after ?? "—"}</div>
    </div>
  );
}

function fmtDateTime(s?: string) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN");
}

function ReturnViewReadOnly({
  inspection,
  baseline,
  returnLateFee = 0,
}: {
  inspection: ReturnInspectionResponse;
  baseline?: HandoverInspection | null;
  returnLateFee?: number;
}) {
  const urls = splitUrls(inspection.images);
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">Biên bản trả xe</div>

      <div className="space-y-1">
        <div className="text-sm text-slate-500">
          Thời điểm lập: {fmtDateTime(inspection.createdAt)} • Nhân viên:{" "}
          {inspection.createdBy || "—"}
        </div>
        <div className="text-sm font-semibold text-grey-600">
          Phí trả trễ: {returnLateFee.toLocaleString("vi-VN")} VNĐ
        </div>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-3 gap-3 px-3 py-2 bg-slate-50 rounded-t-md text-sm font-semibold">
          <div>Mục</div>
          <div>Thời điểm nhận (Handover)</div>
          <div>Thời điểm trả (Return)</div>
        </div>
        <div className="px-3">
          <Row
            label="Odometer (km)"
            before={baseline?.odometer}
            after={inspection.odometer}
          />
          <Row
            label="Battery (%)"
            before={baseline?.batteryPercent}
            after={inspection.batteryPercent}
          />
          <Row
            label="Ghi chú"
            before={baseline?.notes}
            after={inspection.notes}
          />
        </div>
      </div>
      {urls.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Ảnh hiện trạng khi trả xe</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {urls.map((u, i) => (
              <Dialog key={u + i}>
                <DialogTrigger asChild>
                  <img
                    src={u}
                    alt={`return-${i}`}
                    className="w-full h-50 object-cover rounded border cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={u}
                    alt={`preview-${i}`}
                    className="w-full h-auto rounded"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500">Không có ảnh</div>
      )}
    </section>
  );
}

export default function AdminReturnInspectionPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [handover, setHandover] = useState<HandoverInspection | null>(null);
  const [ret, setRet] = useState<ReturnInspectionResponse | null>(null);

  const [initLoading, setInitLoading] = useState(true);

  const title = useMemo(() => "BIÊN BẢN TRẢ XE Ô TÔ", []);
  const hasReturn = !!ret;
  const returnLateFee = useMemo(() => ret?.returnLateFee ?? 0, [ret]);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setInitLoading(true);
      try {
        // Fetch order
        const orderRes = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        setOrder(orderRes.data.data);

        // Fetch handover
        const handoverData = await handoverInspectionAPI.getByOrderId(orderId);
        setHandover(handoverData);

        // Fetch return inspection
        try {
          const latest = (await returnInspectionAPI.getByOrderId(
            orderId
          )) as ReturnInspectionResponse;
          setRet(latest ?? null);
        } catch {
          // Handle error silently
        }
      } catch {
        // Handle error silently
      } finally {
        setInitLoading(false);
      }
    })();
  }, [orderId]);

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

        {/* View or Empty */}
        {hasReturn ? (
          <ReturnViewReadOnly
            inspection={ret!}
            baseline={handover}
            returnLateFee={returnLateFee}
          />
        ) : (
          <div className="text-center text-slate-500 py-8">
            Chưa có biên bản trả xe
          </div>
        )}
      </div>
    </section>
  );
}

