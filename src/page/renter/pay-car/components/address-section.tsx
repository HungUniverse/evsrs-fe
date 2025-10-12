import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { carEVAPI } from "@/apis/car-ev.api";

type DepotLite = {
  id: string;
  name: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  mapId?: string;
};

export default function AddressSelect({
  province,
  modelId,
  value,
  onChange,
}: {
  province: string;
  modelId: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [depots, setDepots] = useState<DepotLite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!modelId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await carEVAPI.getAll({
          pageNumber: 1,
          pageSize: 500,
          status: "AVAILABLE",
          modelId,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (res.data as any)?.data ?? res.data ?? {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = data.items ?? [];

        // unique depot theo id + lọc theo province đang chọn
        const map = new Map<string, DepotLite>();
        for (const it of items) {
          const d = it.depot;
          if (!d?.id) continue;
          if (province && (d.province ?? "") !== province) continue;
          if (!map.has(d.id)) {
            map.set(d.id, {
              id: d.id,
              name: d.name,
              province: d.province,
              district: d.district,
              ward: d.ward,
              street: d.street,
              mapId: d.mapId,
            });
          }
        }
        setDepots([...map.values()]);
      } finally {
        setLoading(false);
      }
    })();
  }, [modelId, province]);

  return (
    <section className="space-y-2">
      <label className="text-sm text-slate-600">Nơi nhận xe *</label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={loading ? "Đang tải..." : "Chọn địa chỉ chi tiết"}
          />
        </SelectTrigger>
        <SelectContent>
          {depots.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name} — {d.street}, {d.district}
            </SelectItem>
          ))}
          {depots.length === 0 && !loading && (
            <div className="px-3 py-2 text-sm text-slate-500">
              Không có trạm phù hợp
            </div>
          )}
        </SelectContent>
      </Select>
    </section>
  );
}
