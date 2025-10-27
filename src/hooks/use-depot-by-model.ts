import { useQuery } from "@tanstack/react-query";
import { carEVAPI } from "@/apis/car-ev.api";
import type { Depot } from "@/@types/car/depot";
import type { CarEV } from "@/@types/car/carEv";
import type { ID } from "@/@types/common/pagination";

const isAvailable = (st: unknown) => st === "AVAILABLE";

export function useDepotsByModel(opts: {
  modelId?: ID;
  province?: string;
  onlyAvailable?: boolean;
  pageSize?: number;
}) {
  const { modelId, province, onlyAvailable = true, pageSize = 200 } = opts;

  return useQuery({
    enabled: !!modelId,
    queryKey: ["depots-by-model", modelId, province, onlyAvailable, pageSize],
    queryFn: async () => {
      const res = await carEVAPI.getAll({
        pageNumber: 1,
        pageSize,
        modelId: modelId!,
        status: "AVAILABLE", // Chỉ lấy xe có status AVAILABLE
      });

      const items: CarEV[] = res.data.items ?? [];
      const normProvince = (province ?? "").trim().toLowerCase();

      const map = new Map<string, { depot: Depot; count: number }>();

      for (const car of items) {
        const carModelId = car.modelId ?? car.model?.id;
        if (carModelId !== modelId) continue;
        // Double check to ensure only AVAILABLE cars are counted
        if (onlyAvailable && !isAvailable(car.status)) continue;

        const dep = car.depot as Depot | undefined;
        const depotId = dep?.id ?? car.depotId;
        if (!depotId || !dep) continue;

        if (
          normProvince &&
          dep.province &&
          !dep.province.toLowerCase().includes(normProvince)
        ) {
          continue;
        }

        const prev = map.get(depotId);
        if (prev) prev.count += 1;
        else map.set(depotId, { depot: dep, count: 1 });
      }

      return Array.from(map.values()).sort((a, b) =>
        a.depot.name.localeCompare(b.depot.name)
      );
    },
  });
}
