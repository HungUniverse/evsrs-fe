import { fmtRange } from "@/hooks/fmt-date-time";

type Props = {
  licensePlate?: string; // placeholder biển số (chưa có API)
  startAt: string;
  endAt: string;
  carName?: string;
};

export default function CarInfo({
  licensePlate,
  startAt,
  endAt,
  carName,
}: Props) {
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">2. Thông tin xe và thời gian thuê</div>

      <div className="grid md:grid-cols-3 gap-4">
        <Info label="Xe" value={carName || "—"} />
        <Info label="Biển số" value={licensePlate} />
        <Info label="Thời gian thuê" value={fmtRange(startAt, endAt)} />
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium">{value ?? "—"}</p>
    </div>
  );
}
