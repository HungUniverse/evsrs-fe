import { useMemo } from "react";
import { SystemConfigUtils } from "./use-system-config";

export function useBookingCalc(
  pricePerDay: number,
  start: string,
  end: string,
  discount?: number
) {
  // Calculate hours between start and end
  const hours = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    const h = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60));
    return h > 0 ? h : 1;
  }, [start, end]);
  const systemDepositPercent = SystemConfigUtils.getDepositPercent();
  // Calculate days for display (keep for UI)
  const days = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    const d = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 1;
  }, [start, end]);

  // Apply discount to pricePerDay
  const salePrice =
    discount && discount > 0
      ? Math.round(pricePerDay * (1 - discount / 100))
      : pricePerDay;

  // Calculate hourly rate: (pricePerDay after sale) / 24
  const pricePerHour = salePrice / 24;

  // Calculate total based on hours
  const baseTotal = Math.round(pricePerHour * hours);
  const deposit = Math.round((baseTotal * systemDepositPercent) / 100);

  return { days, hours, baseTotal, deposit, salePrice, pricePerHour };
}
export function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
