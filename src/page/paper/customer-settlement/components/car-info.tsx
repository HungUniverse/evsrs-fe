import { fmtRange } from "@/hooks/fmt-date-time";
import type { ReturnInspectionRequest } from "@/@types/order/return-inspection";
import type { CarEV } from "@/@types/car/carEv";
import type { HandoverInspection } from "@/@types/order/handover-inspection";

import { useEffect, useState } from "react";
import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";
import InspectionImagesByOrder from "../../return-settlement/components/inspection-image";

type Props = {
  car: CarEV;
  // allow this component to fetch inspections directly
  orderId?: string;
  startAt: string;
  endAt: string;
  // optional callback for parent to get inspections
};

export default function CarInfo({ car, orderId, startAt, endAt }: Props) {
  const [handoverInspection, setHandoverInspection] =
    useState<HandoverInspection | null>(null);
  const [returnInspection, setReturnInspection] =
    useState<ReturnInspectionRequest | null>(null);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const [handover, ret] = await Promise.all([
          handoverInspectionAPI.getByOrderId(orderId),
          returnInspectionAPI.getByOrderId(orderId),
        ]);
        setHandoverInspection(handover ?? null);
        const retData = ret ?? null;
        setReturnInspection(retData);
      } catch (error) {
        console.error("Error loading inspections in CarInfo:", error);
      }
    })();
  }, [orderId]);

  console.log("CarInfo Inspections:", {
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
            <Info label="Biển số" value={car.licensePlate} />
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
