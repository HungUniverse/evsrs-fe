import type { HandoverInspection } from "@/@types/order/handover-inspection";
import { splitUrls } from "@/hooks/split-url";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export default function InspectionView({
  inspection,
}: {
  inspection: HandoverInspection;
}) {
  const urls = splitUrls(inspection.images);
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
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Ảnh bàn giao</p>
        {urls.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {urls.map((u, i) => (
              <Dialog key={u + i}>
                <DialogTrigger asChild>
                  <img
                    src={u}
                    alt={`handover-${i}`}
                    className="w-full h-28 object-cover rounded border cursor-pointer"
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
        ) : (
          <div className="text-sm text-slate-500">Không có ảnh</div>
        )}
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
