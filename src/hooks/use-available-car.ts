import { useQuery } from "@tanstack/react-query";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV } from "@/@types/car/carEv";
import type { ID } from "@/@types/common/pagination";

const AVAILABLE_STATUSES = new Set(["AVAILABLE", "IDLE"]);

export function useAvailableCarEVs(opts: {
  modelId?: ID;
  depotId?: ID;
  pageSize?: number;
}) {
  const { modelId, depotId, pageSize = 100 } = opts;

  return useQuery({
    enabled: !!modelId && !!depotId,
    queryKey: ["available-cars", modelId, depotId, pageSize],
    queryFn: async () => {
      const res = await carEVAPI.getAll({
        pageNumber: 1,
        pageSize,
        modelId: modelId!,
        depotId: depotId!,
      });

      const all: CarEV[] = res.data.items ?? [];

      const sameDepot = all.filter(
        (c) => (c?.depot?.id ?? c?.depotId) === depotId
      );

      const available = sameDepot.filter(
        (c) => c?.status && AVAILABLE_STATUSES.has(String(c.status))
      );

      return {
        all,
        available,
        count: available.length,
      };
    },
  });
}
