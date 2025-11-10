import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";

// Helper functions
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const fmtHHMM = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

const formatDateISO = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const toDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date();
  dt.setFullYear(y, (m ?? 1) - 1, d ?? 1);
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const fmtVN = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
};

// Generate time slots 06:00 -> 22:00 step 30'
const SLOTS = (() => {
  const arr: string[] = [];
  for (let t = 6 * 60; t <= 22 * 60; t += 30) arr.push(fmtHHMM(t));
  return arr;
})();

type DateRange = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

type DatePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: DateRange;
  onChange: (value: DateRange) => void;
  title?: string;
  showTimeSelection?: boolean;
  allowPastDates?: boolean; // For staff offline booking
  disableTimeValidation?: boolean; // Disable current time validation
};

export default function DatePicker({
  open,
  onOpenChange,
  value,
  onChange,
  title = "Chọn thời gian",
  showTimeSelection = true,
  allowPastDates = false,
  disableTimeValidation = false,
}: DatePickerProps) {
  const { startDate, endDate, startTime, endTime } = value;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayISO = formatDateISO(now);

  // Filter start time: disable times before current time if today
  const startTimeOptions = useMemo(() => {
    if (disableTimeValidation || startDate !== todayISO) return SLOTS;
    return SLOTS.filter((t) => toMinutes(t) >= currentMinutes);
  }, [startDate, todayISO, currentMinutes, disableTimeValidation]);

  // Disable end times earlier than start when same day
  const endTimeOptions = useMemo(() => {
    if (endDate !== startDate) return SLOTS;
    const minMins = toMinutes(startTime);
    return SLOTS.filter((t) => toMinutes(t) >= minMins);
  }, [startTime, startDate, endDate]);

  const handleStartDateSelect = (clickedDate: Date) => {
    if (!allowPastDates && clickedDate < today) return;

    const clickedISO = formatDateISO(clickedDate);

    // If selecting today, validate and adjust startTime if needed
    if (!disableTimeValidation && clickedISO === todayISO) {
      const currentTime = toMinutes(startTime);
      if (currentTime < currentMinutes) {
        // Find next available slot
        const nextSlot = SLOTS.find((t) => toMinutes(t) >= currentMinutes);
        if (nextSlot) {
          onChange({
            ...value,
            startDate: clickedISO,
            startTime: nextSlot,
            endDate: clickedISO > endDate ? clickedISO : endDate,
          });
          return;
        }
      }
    }

    const newValue = { ...value, startDate: clickedISO };

    // If start > end, update end = start
    if (clickedISO > endDate) {
      newValue.endDate = clickedISO;
    }

    onChange(newValue);
  };

  const handleDateChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range || !range.from) return;

    const clickedDate = range.from;
    if (!allowPastDates && clickedDate < today) return;

    // Single click - set as start date
    if (!range.to) {
      handleStartDateSelect(clickedDate);
      return;
    }

    // Range selection
    const from = range.from;
    const to = range.to;

    if (!allowPastDates && (from < today || to < today)) return;

    const safeStartISO = formatDateISO(from);
    const safeEndISO = formatDateISO(to);

    const newValue = {
      ...value,
      startDate: safeStartISO,
      endDate: safeEndISO,
    };

    // If selecting today as start, validate and adjust startTime
    if (!disableTimeValidation && safeStartISO === todayISO) {
      const currentTime = toMinutes(startTime);
      if (currentTime < currentMinutes) {
        const nextSlot = SLOTS.find((t) => toMinutes(t) >= currentMinutes);
        if (nextSlot) {
          newValue.startTime = nextSlot;
        }
      }
    }

    // If same day and endTime < startTime, adjust endTime
    if (
      safeStartISO === safeEndISO &&
      toMinutes(endTime) < toMinutes(startTime)
    ) {
      newValue.endTime = startTime;
    }

    onChange(newValue);
  };

  const handleStartTimeChange = (val: string) => {
    const newValue = { ...value, startTime: val };

    // If same day & endTime < startTime, adjust endTime
    if (endDate === startDate && toMinutes(endTime) < toMinutes(val)) {
      newValue.endTime = val;
    }

    onChange(newValue);
  };

  const handleEndTimeChange = (val: string) => {
    onChange({ ...value, endTime: val });
  };

  // Calculate booking duration using useBookingCalc
  const startISO = `${startDate}T${startTime}:00`;
  const endISO = `${endDate}T${endTime}:00`;
  const { shiftLabel } = useBookingCalc(0, startISO, endISO);

  // Summary display
  const summary = `${startTime}, ${fmtVN(startDate)} - ${endTime}, ${fmtVN(endDate)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "40vw",
          maxWidth: "95vw",
          maxHeight: "300vh",
          height: "70vh",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* Calendar 2 tháng – chọn range ngày */}
        <div className="rounded-xl border p-4 overflow-x-auto mr-5 ml-5">
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .rdp-day_selected,
              .rdp-day_selected:hover,
              .rdp-day_selected:focus {
                background-color: #374151 !important;
                color: white !important;
              }
              .rdp-day_range_middle {
                background-color: #f1f5f9 !important;
              }
            `,
            }}
          />

          <Calendar
            mode="range"
            numberOfMonths={2}
            disabled={allowPastDates ? undefined : (date) => date < today}
            selected={{ from: toDate(startDate), to: toDate(endDate) }}
            onSelect={handleDateChange}
            className="mx-auto px-4 py-1 w-10vh h-10vh pt-5 w-[550px] font-md text-[15px]"
            style={
              {
                "--rdp-accent": "#374151", // gray-700
                "--rdp-accent-foreground": "#ffffff",
              } as React.CSSProperties
            }
            classNames={{
              caption_label: "text-lg font-semibold", // tiêu đề tháng to + hơi đậm
              day: "text-base font-normal", // số ngày bình thường
              nav_button: "h-9 w-9", // nút prev/next lớn hơn
              day_selected:
                "!bg-gray-700 !text-white hover:!bg-gray-700 focus:!bg-gray-700 font-semibold", // màu xám đậm, không chói
              day_range_middle: "bg-slate-200", // màu giữa range nhẹ
              day_today: [
                "relative font-semibold",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:bottom-1 after:w-4 after:h-[2px] after:bg-red-500",
              ].join(" "),
            }}
            buttonVariant="outline"
          />
        </div>

        {/* Time Selection */}
        {showTimeSelection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nhận xe */}
            <div className="border rounded-xl p-3">
              <div className="text-sm text-muted-foreground mb-1">Nhận xe</div>
              <div className="flex items-center gap-2">
                <div className="font-medium">{fmtVN(startDate)}</div>
                <Select value={startTime} onValueChange={handleStartTimeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {startTimeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trả xe */}
            <div className="border rounded-xl p-3">
              <div className="text-md text-muted-foreground mb-1">Trả xe</div>
              <div className="flex items-center gap-2">
                <div className="font-medium">{fmtVN(endDate)}</div>
                <Select value={endTime} onValueChange={handleEndTimeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {endTimeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Footer tóm tắt + Tiếp tục */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-md">
              <span className="font-medium">{summary}</span>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              Tiếp tục
            </Button>
          </div>
          {/* Display rental duration */}
          <div className="text-md text-slate-600 text-left">
            Thời gian thuê:{" "}
            <span className="font-semibold text-slate-800">{shiftLabel}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export types for convenience
export type { DateRange };
