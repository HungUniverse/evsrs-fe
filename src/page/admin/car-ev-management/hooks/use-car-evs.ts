import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV, CarEVRequest } from "@/@types/car/carEv";
import type { PaginationResponse } from "@/@types/common/pagination";

export type CarEVsListParams = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sort?: "licensePlate" | "modelName" | "depotName" | "status" | "batteryHealth" | "createdAt" | "none";
  depotId?: string;
  modelId?: string;
  status?: string;
};

const queryKeys = {
  list: (params: CarEVsListParams) => ["car-evs", "list", params] as const,
};

export function useCarEVsList(params: CarEVsListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      const res = await carEVAPI.getAll({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize || 1000,
      });
      const payload = res.data as PaginationResponse<CarEV>;
      let items = payload.items || [];
      // client-side search/sort/filter for now
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((x) => (x.licensePlate || "").toLowerCase().includes(q));
      }
      if (params.depotId && params.depotId !== "all") {
        items = items.filter((x) => x.depot?.id === params.depotId);
      }
      if (params.modelId && params.modelId !== "all") {
        items = items.filter((x) => x.model?.id === params.modelId);
      }
      if (params.status && params.status !== "all") {
        items = items.filter((x) => x.status === params.status);
      }
      if (params.sort && params.sort !== "none") {
        items = [...items].sort((a, b) => {
          switch (params.sort) {
            case "licensePlate":
              return (a.licensePlate || "").localeCompare(b.licensePlate || "");
            case "modelName":
              return (a.model?.modelName || "").localeCompare(b.model?.modelName || "");
            case "depotName":
              return (a.depot?.name || "").localeCompare(b.depot?.name || "");
            case "status":
              return (a.status || "").localeCompare(b.status || "");
            case "batteryHealth":
              return parseFloat(a.batteryHealthPercentage || "0") - parseFloat(b.batteryHealthPercentage || "0");
            case "createdAt":
              return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            default:
              return 0;
          }
        });
      }
      return { items, meta: payload };
    },
  });
}

export function useCarEVMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["car-evs", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: CarEVRequest) => carEVAPI.create(data),
    onSuccess: invalidateList,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CarEVRequest }) => carEVAPI.update(id, data),
    onSuccess: invalidateList,
  });

  const remove = useMutation({
    mutationFn: (id: string) => carEVAPI.delete(id),
    onSuccess: invalidateList,
  });

  return { create, update, remove };
}

