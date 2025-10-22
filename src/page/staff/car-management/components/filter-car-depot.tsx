import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { CarManufacture } from "@/@types/car/carManufacture";

interface FilterCarDepotProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectManufacturer: string;
  onManufacturerChange: (value: string) => void;
  onReset: () => void;
  manufacturers: CarManufacture[];
  manufacturerMap: Map<string, CarManufacture>;
  depotName: string;
}
const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "AVAILABLE", label: "Sẵn sàng" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "RESERVED", label: "Đang tạm giữ" },
  { value: "REPAIRING", label: "Đang sửa chữa" },
  { value: "UNAVAILABLE", label: "Không khả dụng" },
];
function FilterCarDepot({
  searchTerm,
  onSearchTermChange,
  selectedStatus,
  onStatusChange,
  selectManufacturer,
  onManufacturerChange,
  onReset,
  manufacturers,
  depotName,
}: FilterCarDepotProps) {
  return (
    <div className="bg-white rounded-lg border-0 shadow-sm p-6">
      {depotName && (
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-gray-500">Trạm hiện tại</p>
          <p className="text-lg font-semibold text-gray-900">{depotName}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by License Plate */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo biển số xe..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        {/* Manufacturer Filter */}
        <Select value={selectManufacturer} onValueChange={onManufacturerChange}>
          <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
            <SelectValue placeholder="Tất cả hãng xe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả hãng xe</SelectItem>
            {manufacturers.map((manufacturer) => (
              <SelectItem key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full border-gray-200 hover:bg-gray-50"
        >
          <span className="mr-2">⟲</span>
          Đặt lại
        </Button>
      </div>
    </div>
  );
}

export default FilterCarDepot;
