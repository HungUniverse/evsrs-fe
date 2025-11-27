import { useMemo } from "react";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";

function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export type AutoFeeParams = {
  odoReceive?: string | number | null;
  batReceive?: string | number | null;
  odoReturn?: string | number | null;
  batReturn?: string | number | null;
  limitDailyKm?: string | number | null;
  startAt?: string | null;
  endAt?: string | null;
  ratePerKm?: number;
  batteryCapacityKwh?: string | number | null;
  batteryHealthPercentage?: string | number | null;
  electricityFee?: string | number | null;
};

export function useAutoFees(p: AutoFeeParams) {
  const {
    odoReceive,
    batReceive,
    odoReturn,
    batReturn,
    limitDailyKm,
    startAt,
    endAt,
    ratePerKm,
    batteryCapacityKwh,
    batteryHealthPercentage,
    electricityFee,
  } = p;

  const { days } = useBookingCalc(
    0,
    String(startAt ?? ""),
    String(endAt ?? "")
  );

  const calc = useMemo(() => {
    const oReceive = toNum(odoReceive);
    const oReturn = toNum(odoReturn);
    const bReceive = toNum(batReceive);
    const bReturn = toNum(batReturn);
    const daily = toNum(limitDailyKm);

    const odoDiff = oReturn - oReceive;
    let batDiff = bReceive - bReturn; // % hao
    if (batDiff < 0) {
      batDiff = 0;
    }
    const permittedKm = daily * (days > 0 ? days : 1);
    const exceededKm = Math.max(0, odoDiff - permittedKm);

    const overKmFee = Math.max(0, exceededKm) * (ratePerKm ?? 0);

    const capacity = toNum(batteryCapacityKwh);
    const healthPercent = toNum(batteryHealthPercentage) / 100;
    const elecFee = toNum(electricityFee);
    const batteryFee = capacity * healthPercent * Math.abs(batDiff) * elecFee;

    return {
      days,
      odoDiff,
      batDiff,
      permittedKm,
      exceededKm,
      overKmFee,
      batteryFee,
      autoFeesTotal: overKmFee + batteryFee,
      ratePerKm,
      daily,
    };
  }, [
    odoReceive,
    odoReturn,
    batReceive,
    batReturn,
    limitDailyKm,
    days,
    ratePerKm,
    batteryCapacityKwh,
    batteryHealthPercentage,
    electricityFee,
  ]);

  return calc;
}
