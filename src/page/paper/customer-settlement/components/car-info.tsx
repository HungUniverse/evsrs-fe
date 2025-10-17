import { fmtRange } from "@/hooks/fmt-date-time";
import type { ReturnInspection } from "@/@types/order/return-inspection";
import type { CarEV } from "@/@types/car/carEv";
import type { HandoverInspection } from "@/@types/order/handover-inspection";

type Props = {
  car: CarEV;
  handoverInspection?: HandoverInspection | null;
  returnInspection?: ReturnInspection | null;
  startAt: string;
  endAt: string;
};

export default function CarInfo({
  car,
  handoverInspection,
  returnInspection,
  startAt,
  endAt,
}: Props) {
  console.log("CarInfo Props:", {
    handoverOdo: handoverInspection?.odometer,
    returnOdo: returnInspection?.odometer,
    handoverBattery: handoverInspection?.batteryPercent,
    returnBattery: returnInspection?.batteryPercent,
  });
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">2. Thông tin xe và thời gian thuê</div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="font-medium">Thông tin cơ bản:</div>
          <div className="grid grid-cols-2 gap-4">
            <Info label="Xe" value={car.model?.modelName} />
            <Info label="Biển số" value={car.id} />
            <Info
              label="ODO lúc giao"
              value={
                handoverInspection?.odometer
                  ? `${handoverInspection.odometer} km`
                  : undefined
              }
            />
            <Info
              label="ODO lúc trả"
              value={
                returnInspection?.odometer
                  ? `${returnInspection.odometer} km`
                  : undefined
              }
            />
            <Info
              label="Pin lúc giao"
              value={
                handoverInspection?.batteryPercent
                  ? `${handoverInspection.batteryPercent}%`
                  : undefined
              }
            />
            <Info
              label="Pin lúc trả"
              value={
                returnInspection?.batteryPercent
                  ? `${returnInspection.batteryPercent}%`
                  : undefined
              }
            />
            <Info
              label="Tình trạng pin"
              value={
                car.batteryHealthPercentage
                  ? `${car.batteryHealthPercentage}%`
                  : undefined
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-medium">Thời gian thuê:</div>
          <div className="space-y-2">
            <Info label="Thời gian" value={fmtRange(startAt, endAt)} />

            {handoverInspection?.notes && (
              <div>
                <p className="text-sm text-slate-500">Ghi chú lúc giao:</p>
                <p className="font-medium whitespace-pre-wrap">
                  {handoverInspection.notes}
                </p>
              </div>
            )}

            {returnInspection?.notes && (
              <div>
                <p className="text-sm text-slate-500">Ghi chú lúc trả:</p>
                <p className="font-medium whitespace-pre-wrap">
                  {returnInspection.notes}
                </p>
              </div>
            )}
          </div>
        </div>
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
