import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import type { CarManufacture, CarManufactureRequest } from "@/@types/car/carManufacture";
import type { ListBaseResponse } from "@/@types/response";

export type CarManufacturesListParams = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sort?: "name-asc" | "name-desc" | "created-desc" | "created-asc" | "updated-desc" | "updated-asc";
};

const queryKeys = {
  list: (params: CarManufacturesListParams) => ["car-manufactures", "list", params] as const,
};

export function useCarManufacturesList(params: CarManufacturesListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      const res = await CarManufactureAPI.getAll(params.pageNumber, params.pageSize);
      const payload = res.data as ListBaseResponse<CarManufacture>;
      let items = payload.data.items || [];
      // client-side search/sort for now
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((x) => (x.name || "").toLowerCase().includes(q));
      }
      if (params.sort) {
        items = [...items].sort((a, b) => {
          switch (params.sort) {
            case "name-asc":
              return (a.name || "").localeCompare(b.name || "");
            case "name-desc":
              return (b.name || "").localeCompare(a.name || "");
            case "created-asc":
              return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            case "created-desc":
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            case "updated-asc":
              return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
            case "updated-desc":
            default:
              return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
          }
        });
      }
      return { items, meta: payload.data };
    },
  });
}

export function useCarManufactureMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["car-manufactures", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: CarManufactureRequest) => CarManufactureAPI.create(data),
    onSuccess: invalidateList,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CarManufactureRequest }) => CarManufactureAPI.update(id, data),
    onSuccess: invalidateList,
  });

  const remove = useMutation({
    mutationFn: (id: string) => CarManufactureAPI.delete(id),
    onSuccess: invalidateList,
  });

  return { create, update, remove };
}

