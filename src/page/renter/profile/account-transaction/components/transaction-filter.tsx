import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

export type TransactionFilterValue = {
  code: string;
  dateStart?: string;
  dateEnd?: string;
};

type Props = {
  value: TransactionFilterValue;
  onChange: (v: TransactionFilterValue) => void;
};

export default function TransactionFilter({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Lọc giao dịch
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Code Filter */}
        <div>
          <Label htmlFor="code" className="text-sm font-medium text-gray-700">
            Mã đơn hàng
          </Label>
          <Input
            id="code"
            placeholder="Nhập mã đơn hàng..."
            value={value.code}
            onChange={(e) => onChange({ ...value, code: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Date Start */}
        <div>
          <Label
            htmlFor="dateStart"
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Từ ngày
          </Label>
          <Input
            id="dateStart"
            type="date"
            value={value.dateStart || ""}
            onChange={(e) => onChange({ ...value, dateStart: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Date End */}
        <div>
          <Label
            htmlFor="dateEnd"
            className="text-sm font-medium text-gray-700 flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Đến ngày
          </Label>
          <Input
            id="dateEnd"
            type="date"
            value={value.dateEnd || ""}
            onChange={(e) => onChange({ ...value, dateEnd: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          onClick={() =>
            onChange({ code: "", dateStart: undefined, dateEnd: undefined })
          }
          className="text-gray-600 hover:text-gray-900"
        >
          Đặt lại bộ lọc
        </Button>
      </div>
    </div>
  );
}
