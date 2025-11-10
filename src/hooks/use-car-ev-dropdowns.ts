import { useQuery } from "@tanstack/react-query";
import { depotAPI } from "@/apis/depot.api";
import { modelAPI } from "@/apis/model-ev.api";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import type { ListBaseResponse } from "@/@types/response";

export function useCarEVDropdowns() {
  const depotsQuery = useQuery({
    queryKey: ["depots", "dropdown"],
    queryFn: async () => {
      const res = await depotAPI.getAll(1, 1000);
      const payload = res.data as ListBaseResponse<Depot>;
      return payload.data.items || [];
    },
  });

  const modelsQuery = useQuery({
    queryKey: ["models", "dropdown"],
    queryFn: async () => {
      const res = await modelAPI.getAll(1, 1000);
      const payload = res.data as ListBaseResponse<Model>;
      return payload.data.items || [];
    },
  });

  return {
    depots: depotsQuery.data || [],
    models: modelsQuery.data || [],
    isLoading: depotsQuery.isLoading || modelsQuery.isLoading,
  };
}

