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
    const batDiff = bReceive - bReturn; // % hao

    const permittedKm = daily * (days > 0 ? days : 1);
    const exceededKm = Math.max(0, odoDiff - permittedKm);

    const overKmFee = Math.max(0, exceededKm) * (ratePerKm ?? 0);

    return {
      days,
      odoDiff,
      batDiff,
      permittedKm,
      exceededKm,
      overKmFee,
      autoFeesTotal: overKmFee,
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
  ]);

  return calc;
}
