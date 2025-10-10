import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { mockDepots } from "@/mockdata/mock-location";
import type { Depot } from "@/@types/car/depot";

export default function AddressSelect({
  province,
  value,
  onChange,
}: {
  province: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const depots: Depot[] = mockDepots.filter((d) => d.province === province);

  return (
    <section className="space-y-2">
      <label className="text-sm text-slate-600">Nơi nhận xe *</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn địa chỉ chi tiết" />
        </SelectTrigger>
        <SelectContent>
          {depots.map((d) => (
            <SelectItem key={d.id} value={d.mapId}>
              {d.name} — {d.street}, {d.district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
