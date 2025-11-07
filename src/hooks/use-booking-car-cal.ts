import { useMemo } from "react";
import { SystemConfigUtils } from "./use-system-config";

type ShiftLabel =
  | "Ca sáng"
  | "Ca chiều"
  | "1 ngày"
  | `${number} ngày`
  | `${number} ngày và ca sáng`
  | `${number} ngày và ca chiều`;

const MIN = 60_000;
const HOUR = 60 * MIN;

function dayStart(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function windowOn(day: Date, h1: number, m1: number, h2: number, m2: number) {
  const a = new Date(day);
  a.setHours(h1, m1, 0, 0);
  const b = new Date(day);
  b.setHours(h2, m2, 0, 0);
  return [a, b] as const; // [start, end)
}

function overlaps(a1: Date, a2: Date, b1: Date, b2: Date) {
  return a1 < b2 && b1 <= a2; // true if intervals intersect
}

function calculateMultiplier(
  startISO: string,
  endISO: string
): {
  multiplier: number;
  label: ShiftLabel;
} {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (!(start < end)) return { multiplier: 0, label: "ca sáng" as ShiftLabel };

  // Check special case: đặt ca sáng, trả 6h-7h sáng
  const startDay = dayStart(start);
  const [startMorningBegin, startMorningEnd] = windowOn(startDay, 6, 0, 12, 0);
  const startInMorningShift =
    start >= startMorningBegin && start < startMorningEnd;
  const [startAfternoonBegin, startAfternoonEnd] = windowOn(
    startDay,
    12,
    30,
    22,
    0
  );
  const startInAfternoonShift =
    start >= startAfternoonBegin && start < startAfternoonEnd;

  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  const endInGracePeriod = endHour === 6 || (endHour === 7 && endMinute === 0);

  // Nếu đặt sáng và trả trong khung 6h-7h sáng, chỉ tính số ngày nguyên

  let cursor = dayStart(start);
  let multiplier = 0;

  while (cursor < end) {
    const nextDay = new Date(cursor.getTime() + 24 * HOUR);

    // Booking segment within this day
    const segStart =
      start < nextDay ? (start > cursor ? start : cursor) : nextDay;
    const segEnd = end < nextDay ? end : nextDay;

    // Shift windows of this day
    const [mStart, mEnd] = windowOn(cursor, 6, 0, 12, 0); // sáng 6:00–12:00
    const [aStart, aEnd] = windowOn(cursor, 12, 30, 22, 0); // chiều 12:30–22:00

    const hitMorning = overlaps(segStart, segEnd, mStart, mEnd);
    const hitAfternoon = overlaps(segStart, segEnd, aStart, aEnd);

    if (hitMorning) multiplier += 0.4;
    if (hitAfternoon) multiplier += 0.6;

    cursor = nextDay;
  }

  console.log("Before grace period:", {
    multiplier,
    startInAfternoonShift,
    endInGracePeriod,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });
  const case1 = startInMorningShift && endInGracePeriod;
  const case2 = startInAfternoonShift && endInGracePeriod && multiplier > 1.0;

  const applyGracePeriod = case1 || case2;
  // Áp dụng grace period: nếu đặt sáng và trả 6h-7h sáng, làm tròn xuống số ngày nguyên
  if (applyGracePeriod) {
    multiplier = multiplier - 0.4;
    console.log("mul" + multiplier);
  }

  // Label cho trường hợp hiển thị
  let label: ShiftLabel;
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    const day0 = dayStart(start);
    const [mStart, mEnd] = windowOn(day0, 6, 0, 12, 30);
    const [aStart, aEnd] = windowOn(day0, 12, 30, 22, 0);
    const hitMorning = overlaps(start, end, mStart, mEnd);
    const hitAfternoon = overlaps(start, end, aStart, aEnd);
    label =
      hitMorning && hitAfternoon
        ? "1 ngày"
        : hitMorning
          ? "Ca sáng"
          : "Ca chiều";
  } else {
    // For multi-day, check fractional part
    const wholeDays = Math.floor(multiplier);
    const fractionalPart = multiplier - wholeDays;

    if (fractionalPart === 0) {
      label = `${wholeDays} ngày`;
    } else if (Math.abs(fractionalPart - 0.4) < 0.01) {
      // Has morning shift remainder
      label = `${wholeDays} ngày và ca sáng`;
    } else if (Math.abs(fractionalPart - 0.6) < 0.01) {
      // Has afternoon shift remainder
      label = `${wholeDays} ngày và ca chiều`;
    } else {
      // Round up for display
      label = `${Math.ceil(multiplier)} ngày`;
    }
  }

  return { multiplier, label };
}

export function useBookingCalc(
  pricePerDay: number,
  start: string,
  end: string,
  discount?: number
) {
  // Calculate hours between start and end (for display purposes)
  const hours = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    const h = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60));
    return h > 0 ? h : 1;
  }, [start, end]);

  const systemDepositPercent = SystemConfigUtils.getDepositPercent();

  // Calculate multiplier (shift-based or day-based)
  const result = useMemo(() => {
    return calculateMultiplier(start, end);
  }, [start, end]);

  const shiftMultiplier = result.multiplier;
  const shiftLabel = result.label;

  // Calculate days for display (keep for UI)
  const days = useMemo(() => {
    return shiftMultiplier;
  }, [shiftMultiplier]);

  // Apply discount to pricePerDay
  const salePrice =
    discount && discount > 0
      ? Math.round(pricePerDay * (1 - discount / 100))
      : pricePerDay;

  // Calculate total based on shift multiplier
  const baseTotal = Math.round(salePrice * shiftMultiplier);
  const deposit = Math.round((baseTotal * systemDepositPercent) / 100);

  return {
    days,
    hours,
    baseTotal,
    deposit,
    salePrice,
    shiftMultiplier,
    shiftLabel,
    pricePerHour: salePrice / 24, // Keep for backward compatibility
  };
}
export function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
