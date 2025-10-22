// hooks/use-manufature.ts
import { useEffect, useMemo, useState } from "react";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import type { CarManufacture } from "@/@types/car/carManufacture";

const resolveLogoUrl = (u?: string) => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  const rel = u.startsWith("/") ? u : `/${u}`;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}${rel}`;
};

export function useManufactures() {
  const [map, setMap] = useState<Map<string, CarManufacture>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await CarManufactureAPI.getAll(1, 200);
        const items = res.data?.data?.items ?? [];
        const m = new Map<string, CarManufacture>();
        (items as CarManufacture[]).forEach((it) => m.set(String(it.id), it));
        setMap(m);
      } catch {
        setError("Không thể tải danh sách hãng xe");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const list = useMemo(
    () =>
      Array.from(map.values()).map((x) => ({
        id: String(x.id),
        name: x.name ?? "Hãng xe",
        logoUrl: resolveLogoUrl(x.logo), // hỗ trợ cả 'logo'/'logoUrl'
      })),
    [map]
  );

  return { map, list, loading, error };
}
