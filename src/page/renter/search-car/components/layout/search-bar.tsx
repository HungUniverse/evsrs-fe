import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronDown, MapPin, Search } from "lucide-react";

type Props = {
  onSearch?: () => void;
};

export default function SearchBar({ onSearch }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-2xl shadow-sm border flex flex-col md:flex-row md:items-stretch overflow-hidden">
        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <div className="text-xs text-slate-500">Địa điểm</div>
            <button className="w-full text-left font-medium flex items-center justify-between">
              <span>TP. Hồ Chí Minh</span>
              <ChevronDown className="w-4 h-4 opacity-60" />
            </button>
          </div>
        </div>

        {/* Date range */}
        <div className="flex-[1.5] flex items-center gap-3 px-4 py-3">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <div className="text-xs text-slate-500">Thời gian thuê</div>
            <button className="w-full text-left font-medium flex items-center justify-between">
              <span>21:00, 16/09/2026 - 20:00, 17/09/2026</span>
              <ChevronDown className="w-4 h-4 opacity-60" />
            </button>
          </div>
        </div>

        {/* Action */}
        <div className="px-4 py-3 md:p-3">
          <Button onClick={onSearch} className="rounded-xl px-6 gap-2">
            <Search className="w-4 h-4" />
            Tìm Xe
          </Button>
        </div>
      </div>
    </div>
  );
}
