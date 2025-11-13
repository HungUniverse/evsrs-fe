import { useQuery } from "@tanstack/react-query";
import { depotAPI } from "@/apis/depot.api";
import type { Depot } from "@/@types/car/depot";
import type { ListBaseResponse } from "@/@types/response";

export function useDepotDropdowns() {
  const depotsQuery = useQuery({
    queryKey: ["depots", "dropdown"],
    queryFn: async () => {
      const res = await depotAPI.getAll(1, 1000);
      const payload = res.data as ListBaseResponse<Depot>;
      return payload.data.items || [];
    },
  });

  return {
    depots: depotsQuery.data || [],
    isLoading: depotsQuery.isLoading,
  };
}

