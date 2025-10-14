import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import type { ID } from "@/@types/common/pagination";
import { useDepotsByModel } from "@/hooks/use-depot-by-model";

type Props = {
  province?: string;
  modelId: ID;
  value: ID;
  onChange: (id: ID) => void;
};

export default function AddressSelect({
  province,
  modelId,
  value,
  onChange,
}: Props) {
  const { data: depots = [], isLoading } = useDepotsByModel({
    modelId,
    province,
  });

  useEffect(() => {
    if (!isLoading && depots.length === 1 && value !== depots[0].depot.id) {
      onChange(depots[0].depot.id);
    }
  }, [isLoading, depots, value, onChange]);

  const placeholder = isLoading
    ? "Đang tải trạm..."
    : depots.length
      ? "Chọn trạm có xe"
      : "Không có trạm phù hợp";

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading || depots.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {depots.map(({ depot, count }) => (
            <SelectItem key={depot.id} value={depot.id}>
              {depot.name}
              {depot.district ? ` • ${depot.district}` : ""}
              {depot.ward ? `, ${depot.ward}` : ""}
              <span className="ml-1 text-xs text-muted-foreground">
                ({count} xe)
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isLoading && depots.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Không tìm thấy trạm có xe AVAILABLE cho model này.
        </p>
      )}
    </div>
  );
}
