import { useQuery } from "@tanstack/react-query";
import { depotAPI } from "@/apis/depot.api";
import type { Depot } from "@/@types/car/depot";

export function useDepotDropdowns() {
  const {
    data: depots = [],
    isLoading,
  } = useQuery({
    queryKey: ["depots", "dropdown"],
    queryFn: async () => {
      const res = await depotAPI.getAll(1, 1000); // Get all depots
      return (res.data?.data?.items || []) as Depot[];
    },
  });

  return {
    depots,
    isLoading,
  };
}

