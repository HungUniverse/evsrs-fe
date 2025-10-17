import type { HandoverInspection } from "@/@types/order/handover-inspection";
import type { ReturnInspectionResponse } from "@/@types/order/return-inspection";
import { Button } from "@/components/ui/button";

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

export default function ReturnView({
  inspection,
  baseline,
  canConfirmReturn = false,
  confirming = false,
  onConfirmReturn,
}: {
  inspection: ReturnInspectionResponse;
  baseline?: HandoverInspection | null;
  canConfirmReturn?: boolean;
  confirming?: boolean;
  onConfirmReturn?: () => void;
}) {
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">Biên bản trả xe</div>

      <div className="text-sm text-slate-500">
        Thời điểm lập: {fmtDateTime(inspection.createdAt)} • Nhân viên:{" "}
        {inspection.createdBy || "—"}
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

      {canConfirmReturn && (
        <div className="flex justify-end">
          <Button onClick={onConfirmReturn} disabled={confirming}>
            {confirming ? "Đang xác nhận..." : "Xác nhận trả xe"}
          </Button>
        </div>
      )}

      <div className="text-sm text-slate-500">
        Ảnh tình trạng: ("Để sau add vào = cloudinary")
      </div>
    </section>
  );
}
