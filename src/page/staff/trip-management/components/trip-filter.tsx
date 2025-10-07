import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Filter, Search } from "lucide-react";
export type TripFilterValue = {
  orderId: string;
  carModel: string;
  status: string;
  dateStart?: string;
  dateEnd?: string;
};
type Props = {
  value: TripFilterValue;
  onChange: (patch: Partial<TripFilterValue>) => void;
};

function StaffTripFilter({ value, onChange }: Props) {
  const onStartChange = (v: string) => {
    const patch: Partial<TripFilterValue> = { dateStart: v };
    if (value.dateEnd && new Date(value.dateEnd) < new Date(v))
      patch.dateEnd = v;
    onChange(patch);
  };
  return (
    <section className="rounded-xl bg-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-700 font-medium">
        <Filter className="h-4 w-4" />
        <span>Bộ lọc tìm kiếm</span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr_1.4fr]">
        {/* Mã đơn hàng */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Mã đơn hàng"
            className="pl-9"
            value={value.orderId}
            onChange={(e) => onChange({ orderId: e.target.value })}
          />
        </div>

        {/* Dòng xe */}
        <div className="relative">
          <Input
            placeholder="Dòng xe"
            className="pl-9"
            value={value.carModel}
            onChange={(e) => onChange({ carModel: e.target.value })}
          />
        </div>

        {/* Trạng thái */}
        <Select
          value={value.status}
          onValueChange={(v) =>
            onChange({ status: v as TripFilterValue["status"] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="confirmed">Xác nhận</SelectItem>
            <SelectItem value="in_progress">Đang xử lý</SelectItem>
            <SelectItem value="completed">Hoàn tất</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        {/* Ngày nhận - ngày trả */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="date"
              className="pl-9"
              value={value.dateStart ?? ""}
              onChange={(e) => onStartChange(e.target.value)}
              placeholder="Ngày nhận"
            />
          </div>
          <Input
            type="date"
            value={value.dateEnd ?? ""}
            min={value.dateStart || undefined}
            onChange={(e) => onChange({ dateEnd: e.target.value })}
            placeholder="Ngày trả"
          />
        </div>
      </div>
    </section>
  );
}

export default StaffTripFilter;
