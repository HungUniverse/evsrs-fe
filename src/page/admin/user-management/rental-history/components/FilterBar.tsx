import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export default function FilterBar({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }: FilterBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên khách hàng, xe hoặc biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="ongoing">Đang thuê</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


