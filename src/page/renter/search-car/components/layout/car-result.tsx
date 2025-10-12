import { useEffect, useMemo, useState } from "react";
import CarCard from "./car-card";
import {
  groupCarEvsToCards,
  type CarCardVM,
  type CarEvItem,
} from "@/hooks/to-car-card";
import { carEVAPI } from "@/apis/car-ev.api"; // <- file api của bạn

export type Filters = {
  seat?: number[];
  minPrice?: number;
  maxPrice?: number;
  manufacture?: string; // manufacturerCarId
  province?: string;
  sale?: boolean;
  dailyKmLimit?: number;
};

type Props = {
  filters: Filters;
  searchForm: { location: string; start: string; end: string };
};

export default function CarResult({ filters, searchForm }: Props) {
  const [items, setItems] = useState<CarEvItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await carEVAPI.getAll({
          pageNumber: 1,
          pageSize: 200,
          status: "AVAILABLE",
        });
        const data = (res.data as any)?.data ?? res.data ?? {};
        const arr = data.items ?? [];
        setItems(arr);
      } catch (e: any) {
        console.error(
          "CarEV load error:",
          e?.response?.status,
          e?.response?.data,
          e?.message
        );
        setError(
          e?.response?.data?.message ??
            e?.message ??
            "Không thể tải danh sách xe"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredEvs = useMemo(() => {
    const loc = (filters.province || searchForm.location || "").trim();
    const seatSet = new Set((filters.seat ?? []).map(Number));

    let arr = items.filter((x) => x.status === "AVAILABLE");

    if (loc) {
      arr = arr.filter((x) => (x.depot?.province ?? "") === loc);
    }
    if (seatSet.size > 0) {
      arr = arr.filter((x) => seatSet.has(Number(x.model.seats ?? 0)));
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      arr = arr.filter((x) => {
        const price = Number(x.model.price ?? 0);
        const minOk =
          filters.minPrice !== undefined ? price >= filters.minPrice! : true;
        const maxOk =
          filters.maxPrice !== undefined ? price <= filters.maxPrice! : true;
        return minOk && maxOk;
      });
    }
    if (filters.manufacture) {
      arr = arr.filter(
        (x) => (x.model.manufacturerCarId ?? "") === filters.manufacture
      );
    }
    if (filters.sale !== undefined) {
      arr = arr.filter((x) => {
        const d = Number(x.model.sale ?? 0);
        return filters.sale ? d > 0 : d === 0;
      });
    }
    if (filters.dailyKmLimit !== undefined) {
      arr = arr.filter(
        (x) => Number(x.model.limiteDailyKm ?? 0) >= filters.dailyKmLimit!
      );
    }

    // TODO: filter theo ngày start/end nếu có rule “đang bận” (FE/BE sẽ bổ sung)
    return arr;
  }, [items, filters, searchForm]);

  // 3) Gom nhóm thành card Model
  const cards: CarCardVM[] = useMemo(() => {
    const hasLocation = !!(filters.province || searchForm.location);
    // Có chọn location => gom theo modelId (mỗi model 1 card)
    // Không chọn location => gom theo modelId + province (tránh gộp SG với HN)
    return groupCarEvsToCards(filteredEvs, !hasLocation ? true : false);
  }, [filteredEvs, filters, searchForm]);

  if (loading) {
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
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.length > 0 ? (
        cards.map((c) => <CarCard key={c.id} car={c} searchForm={searchForm} />)
      ) : (
        <div className="col-span-full text-center py-10 text-slate-500">
          Không tìm thấy xe phù hợp
        </div>
      )}
    </div>
  );
}
