import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { modelAPI } from "@/apis/model-ev.api";
import type { Model, ModelRequest } from "@/@types/car/model";
import type { ListBaseResponse } from "@/@types/response";

export type ModelsListParams = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sort?: "name-asc" | "name-desc" | "price-asc" | "price-desc" | "range-asc" | "range-desc" | "created-desc" | "created-asc";
  manufacturerCarId?: string;
};

const queryKeys = {
  list: (params: ModelsListParams) => ["models", "list", params] as const,
};

export function useModelsList(params: ModelsListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      const res = await modelAPI.getAll(params.pageNumber, params.pageSize);
      const payload = res.data as ListBaseResponse<Model>;
      let items = payload.data.items || [];
      // client-side search/sort/filter for now
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((x) => (x.modelName || "").toLowerCase().includes(q));
      }
      if (params.manufacturerCarId) {
        items = items.filter((x) => String(x.manufacturerCarId) === params.manufacturerCarId);
      }
      if (params.sort) {
        items = [...items].sort((a, b) => {
          switch (params.sort) {
            case "name-asc":
              return (a.modelName || "").localeCompare(b.modelName || "");
            case "name-desc":
              return (b.modelName || "").localeCompare(a.modelName || "");
            case "price-asc":
              return (a.price || 0) - (b.price || 0);
            case "price-desc":
              return (b.price || 0) - (a.price || 0);
            case "range-asc":
              return parseInt(a.rangeKm || "0") - parseInt(b.rangeKm || "0");
            case "range-desc":
              return parseInt(b.rangeKm || "0") - parseInt(a.rangeKm || "0");
            case "created-asc":
              return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            case "created-desc":
            default:
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          }
        });
      }
      return { items, meta: payload.data };
    },
  });
}

export function useModelMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["models", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: ModelRequest) => modelAPI.create(data),
    onSuccess: invalidateList,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModelRequest }) => modelAPI.update(id, data),
    onSuccess: invalidateList,
  });

  const remove = useMutation({
    mutationFn: (id: string) => modelAPI.delete(id),
    onSuccess: invalidateList,
  });

  return { create, update, remove };
}

