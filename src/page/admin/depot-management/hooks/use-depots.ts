import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { depotAPI } from "@/apis/depot.api";
import type { Depot, DepotRequest } from "@/@types/car/depot";
import type { ListBaseResponse } from "@/@types/response";

export type DepotsListParams = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sort?: "name-asc" | "name-desc" | "province-asc" | "province-desc" | "district-asc" | "district-desc" | "openTime-asc" | "openTime-desc" | "created-desc" | "created-asc";
  province?: string;
  district?: string;
  ward?: string;
};

const queryKeys = {
  list: (params: DepotsListParams) => ["depots", "list", params] as const,
};

export function useDepotsList(params: DepotsListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      const res = await depotAPI.getAll(params.pageNumber, params.pageSize);
      const payload = res.data as ListBaseResponse<Depot>;
      let items = payload.data.items || [];
      // client-side search/sort/filter for now
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((x) => (x.name || "").toLowerCase().includes(q));
      }
      if (params.province) {
        items = items.filter((x) => (x.province || "").toLowerCase().includes(params.province!.toLowerCase()));
      }
      if (params.district) {
        items = items.filter((x) => (x.district || "").toLowerCase().includes(params.district!.toLowerCase()));
      }
      if (params.ward) {
        items = items.filter((x) => (x.ward || "").toLowerCase().includes(params.ward!.toLowerCase()));
      }
      if (params.sort) {
        items = [...items].sort((a, b) => {
          switch (params.sort) {
            case "name-asc":
              return (a.name || "").localeCompare(b.name || "");
            case "name-desc":
              return (b.name || "").localeCompare(a.name || "");
            case "province-asc":
              return (a.province || "").localeCompare(b.province || "");
            case "province-desc":
              return (b.province || "").localeCompare(a.province || "");
            case "district-asc":
              return (a.district || "").localeCompare(b.district || "");
            case "district-desc":
              return (b.district || "").localeCompare(a.district || "");
            case "openTime-asc":
              return (a.openTime || "").localeCompare(b.openTime || "");
            case "openTime-desc":
              return (b.openTime || "").localeCompare(a.openTime || "");
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

export function useDepotMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["depots", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: DepotRequest) => depotAPI.create(data),
    onSuccess: invalidateList,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepotRequest }) => depotAPI.update(id, data),
    onSuccess: invalidateList,
  });

  const remove = useMutation({
    mutationFn: (id: string) => depotAPI.delete(id),
    onSuccess: invalidateList,
  });

  return { create, update, remove };
}

