import type { HandoverInspection } from "@/@types/order/handover-inspection";

export default function InspectionView({
  inspection,
}: {
  inspection: HandoverInspection;
}) {
  // Parse images string into array
  const imageUrls = inspection.images
    ? inspection.images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">3. Biên bản bàn giao</div>

      <div className="grid md:grid-cols-3 gap-4">
        <Info label="Odometer (km)" value={inspection.odometer} />
        <Info label="Battery (%)" value={inspection.batteryPercent} />
        <Info label="Người lập" value={inspection.createdBy} />
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <Info label="Ghi chú" value={inspection.notes || "—"} />
      </div>

      {/* Display images */}
      {imageUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Hình ảnh bàn giao
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Bàn giao ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
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
