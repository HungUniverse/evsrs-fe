import type { HandoverInspection } from "@/@types/order/handover-inspection";

export default function InspectionView({
  inspection,
}: {
  inspection: HandoverInspection;
}) {
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">3. Biên bản bàn giao</div>

      <div className="grid md:grid-cols-3 gap-4">
        <Info label="Odometer (km)" value={inspection.odometer} />
        <Info label="Battery (%)" value={inspection.batteryPercent} />
        <Info label="Người lập" value={inspection.staffId} />
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <Info label="Ghi chú" value={inspection.notes || "—"} />
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium break-words">{value ?? "—"}</p>
    </div>
  );
}
