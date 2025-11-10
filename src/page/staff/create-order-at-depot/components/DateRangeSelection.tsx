import { useState } from "react";
import { CalendarDays } from "lucide-react";
import DatePicker, {
  type DateRange,
} from "@/page/renter/search-car/components/date-picker";
import { fmtVN } from "@/hooks/fmt-date-time";

interface DateRangeSelectionProps {
  startAt: string;
  endAt: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  errors?: {
    startAt?: string;
    endAt?: string;
  };
}

export function DateRangeSelection({
  startAt,
  endAt,
  onStartChange,
  onEndChange,
  errors,
}: DateRangeSelectionProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Parse datetime-local format to DateRange format
  const startDate = startAt ? startAt.slice(0, 10) : "";
  const startTime = startAt ? startAt.slice(11, 16) : "06:00";
  const endDate = endAt ? endAt.slice(0, 10) : "";
  const endTime = endAt ? endAt.slice(11, 16) : "22:00";

  // Initialize with current values or defaults
  const today = new Date().toISOString().slice(0, 10);

  const dateRange: DateRange = {
    startDate: startDate || today,
    endDate: endDate || today,
    startTime: startTime,
    endTime: endTime,
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    // Convert back to datetime-local format
    onStartChange(`${newRange.startDate}T${newRange.startTime}`);
    onEndChange(`${newRange.endDate}T${newRange.endTime}`);
  };

  const summary =
    startAt && endAt
      ? `${startTime}, ${fmtVN(startDate)} - ${endTime}, ${fmtVN(endDate)}`
      : "Chọn thời gian thuê xe";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Thời gian thuê xe</h2>

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
          errors?.startAt || errors?.endAt ? "border-red-500" : ""
        }`}
      >
        <CalendarDays className="w-5 h-5 text-emerald-600" />
        <div className="flex-1">
          <div className="text-sm text-slate-500">Thời gian thuê</div>
          <div className="font-semibold text-base">{summary}</div>
        </div>
      </button>

      {(errors?.startAt || errors?.endAt) && (
        <p className="text-red-500 text-sm">
          {errors?.startAt || errors?.endAt}
        </p>
      )}

      <DatePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        value={dateRange}
        onChange={handleDateRangeChange}
        title="Chọn thời gian thuê xe"
        allowPastDates={true}
        disableTimeValidation={true}
      />
    </div>
  );
}
