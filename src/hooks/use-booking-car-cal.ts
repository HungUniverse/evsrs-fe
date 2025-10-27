import { useMemo } from "react";

export function useBookingCalc(
  pricePerDay: number,
  start: string,
  end: string,
  discount?: number
) {
  const days = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    const d = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 1;
  }, [start, end]);
  const salePrice =
    discount && discount > 0
      ? Math.round(pricePerDay * (1 - discount / 100))
      : pricePerDay;

  const baseTotal = salePrice * days;
  const deposit = baseTotal * 0.3;

  return { days, baseTotal, deposit, salePrice };
}
export function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
