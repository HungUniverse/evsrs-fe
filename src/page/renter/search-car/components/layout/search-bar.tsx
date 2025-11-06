import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Search, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import DatePicker, { type DateRange } from "../date-picker";
import { fmtVN, toLocalDatetimeValue } from "@/hooks/fmt-date-time";

type SearchForm = {
  location: string;
  start: string; // YYYY-MM-DDTHH:mm
  end: string; // YYYY-MM-DDTHH:mm
};

type Props = {
  onSearch?: (values: SearchForm) => void;
};

const PROVINCES = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"];

// build 06:00 -> 23:30 step 30'

export default function SearchBar({ onSearch }: Props) {
  const nowPlus1h = new Date(Date.now() + 60 * 60 * 1000);
  const tomorrowPlus1h = new Date(Date.now() + 25 * 60 * 60 * 1000);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [form, setForm] = useState<SearchForm>({
    location: "TP. Hồ Chí Minh",
    start: toLocalDatetimeValue(nowPlus1h),
    end: toLocalDatetimeValue(tomorrowPlus1h),
  });

  // DateRange for DatePicker component
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: form.start.slice(0, 10),
    endDate: form.end.slice(0, 10),
    startTime: form.start.slice(11, 16),
    endTime: form.end.slice(11, 16),
  });

  // Update form when dateRange changes
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    setForm({
      ...form,
      start: `${newRange.startDate}T${newRange.startTime}`,
      end: `${newRange.endDate}T${newRange.endTime}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(form);
  };

  // summary hiển thị giống Mioto
  const summary = `${dateRange.startTime}, ${fmtVN(dateRange.startDate)} - ${dateRange.endTime}, ${fmtVN(dateRange.endDate)}`;

  return (
    <div className="max-w-6xl mx-auto px-5 mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border flex flex-col md:flex-row md:items-stretch overflow-hidden"
      >
        {/* Địa điểm */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <label className="text-lg text-slate-400 block mb-1">
              Địa điểm
            </label>
            <Select
              value={form.location}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, location: value }))
              }
            >
              <SelectTrigger className="w-full text-lg font-medium border-0 shadow-none focus:ring-0">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nút mở Dialog – Thời gian thuê (giữ form cũ, chỉ thay UI) */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex-[1.8] flex items-center gap-3 px-3 py-3 border-b md:border-b-0 md:border-r text-left"
        >
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <div className="text-lg text-slate-500">Thời gian thuê</div>
            <div className="font-semibold text-lg">{summary}</div>
          </div>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>

        <div className="px-10 py-3 md:p-3 flex items-center">
          <Button
            type="submit"
            className="text-base rounded-xl px-8 py-6 gap-2 min-w-[110px] bg-green-300 hover:bg-green-300 text-white hover:shadow-md transition-shadow duration-150"
          >
            <Search className=" w-6 h-6" />
            Tìm Xe
          </Button>
        </div>
      </form>

      {/* DatePicker Component */}
      <DatePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        value={dateRange}
        onChange={handleDateRangeChange}
        title="Thời gian thuê"
      />
    </div>
  );
}
