import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Thời gian thuê xe</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="start-date">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </Label>
          <Input
            id="start-date"
            type="datetime-local"
            value={startAt}
            onChange={(e) => onStartChange(e.target.value)}
            min={today}
            className={`mt-2 ${errors?.startAt ? "border-red-500" : ""}`}
          />
          {errors?.startAt && (
            <p className="text-red-500 text-sm mt-1">{errors.startAt}</p>
          )}
        </div>

        <div>
          <Label htmlFor="end-date">
            Ngày kết thúc <span className="text-red-500">*</span>
          </Label>
          <Input
            id="end-date"
            type="datetime-local"
            value={endAt}
            onChange={(e) => onEndChange(e.target.value)}
            min={startAt || today}
            className={`mt-2 ${errors?.endAt ? "border-red-500" : ""}`}
          />
          {errors?.endAt && (
            <p className="text-red-500 text-sm mt-1">{errors.endAt}</p>
          )}
        </div>
      </div>

      {startAt && endAt && new Date(endAt) > new Date(startAt) && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Thời gian thuê:</span>{" "}
            {Math.ceil(
              (new Date(endAt).getTime() - new Date(startAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            ngày
          </p>
        </div>
      )}
    </div>
  );
}
