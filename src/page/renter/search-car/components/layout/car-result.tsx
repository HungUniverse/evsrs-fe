import { useEffect, useMemo, useState } from "react";
import CarCard from "./car-card";
import { modelAPI } from "@/apis/model-ev.api";
import type { Model } from "@/@types/car/model";
import { toCarCardVM, type CarCardVM } from "@/hooks/to-car-card";
import { useManufactures } from "@/hooks/use-manufature";

export type Filters = {
  seat?: number[];
  minPrice?: number;
  maxPrice?: number;
  manufacture?: string; // ID để lọc
  province?: string;
  sale?: boolean;
  dailyKmLimit?: number;
};

type Props = {
  filters: Filters;
  searchForm: { location: string; start: string; end: string };
};

export default function CarResult({ filters, searchForm }: Props) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    map: manuMap,
    loading: manuLoading,
    error: manuError,
  } = useManufactures();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await modelAPI.getAll(1, 50);
        const items =
          (res.data as any)?.data?.items ?? (res.data as any)?.items ?? [];
        setModels(items);
      } catch (err) {
        console.error("❌ Lỗi tải models:", err);
        setError("Không thể tải danh sách xe");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const vms: CarCardVM[] = useMemo(
    () => models.map((m) => toCarCardVM(m, undefined, manuMap)),
    [models, manuMap]
  );

  const isLoading = loading || manuLoading;
  const firstError = error || manuError;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-72 rounded-2xl bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (firstError) {
    return <div className="text-center text-red-500 mt-8">{firstError}</div>;
  }

  let filtered = [...vms];

  if (filters.seat?.length) {
    const selected = new Set(filters.seat.map((s) => Number(s)));
    filtered = filtered.filter((c) => selected.has(Number(c.seats)));
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter((c) => {
      const price = c.pricePerDay;
      const minOk =
        filters.minPrice !== undefined ? price >= filters.minPrice! : true;
      const maxOk =
        filters.maxPrice !== undefined ? price <= filters.maxPrice! : true;
      return minOk && maxOk;
    });
  }

  if (filters.manufacture) {
    const id = filters.manufacture;
    filtered = filtered.filter((c) => (c.manufactureId ?? "") === id);
  }

  if (filters.province) {
    filtered = filtered.filter((c) => (c.province ?? "") === filters.province);
  }

  if (filters.sale !== undefined) {
    filtered = filtered.filter((c) => {
      const d = c.discount ?? 0;
      return filters.sale ? d > 0 : d === 0;
    });
  }

  if (filters.dailyKmLimit !== undefined) {
    filtered = filtered.filter(
      (c) => (c.dailyKmLimit ?? 0) >= filters.dailyKmLimit!
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.length > 0 ? (
        filtered.map((c) => (
          <CarCard key={c.id} car={c} searchForm={searchForm} />
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-slate-500">
          Không tìm thấy xe phù hợp
        </div>
      )}
    </div>
  );
}
