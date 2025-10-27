import { useQuery } from "@tanstack/react-query";
import { carEVAPI } from "@/apis/car-ev.api";
import { modelAPI } from "@/apis/model-ev.api";
// import { depotAPI } from "@/apis/depot.ai";
import type { CarEV } from "@/@types/car/carEv";
import type { Model } from "@/@types/car/model";
// import type { Depot } from "@/@types/car/depot";
import { groupCarEvsToCards, type CarCardVM } from "@/hooks/to-car-card";

async function fetchModelsByIds(ids: string[]) {
  const uniq = [...new Set(ids)];
  const models = await Promise.all(uniq.map((id) => modelAPI.getById(id)));
  const map = new Map<string, Model>();
  models
    .filter((m) => m && (m.isDeleted === undefined || m.isDeleted === false))
    .forEach((m) => map.set(m.id, m));
  return map;
}
// async function fetchDepots(ids: string[]) {
//   const uniq = [...new Set(ids)];
//   const rs = await Promise.all(uniq.map((id) => depotAPI.getById(id)));
//   const map = new Map<string, Depot>();
//   rs.forEach((r) => map.set(r.data.id, r.data));
//   return map;
// }

export function useCarEVList(params = { pageNumber: 1, pageSize: 12 }) {
  return useQuery({
    queryKey: ["car-ev-list", params],
    queryFn: async () => {
      const { data } = await carEVAPI.getAll(params);
      const items: CarEV[] = data.items;
      if (!items.length) return { list: [] as CarCardVM[], meta: data };

      const modelMap = await fetchModelsByIds(items.map((i) => i.modelId));

      // Transform CarEV[] to CarEvItem[]
      const carEvItems = items.map((c) => ({
        id: c.id,
        model: {
          id: c.modelId,
          modelName: modelMap.get(c.modelId)?.modelName || "",
          batteryCapacityKwh: modelMap.get(c.modelId)?.batteryCapacityKwh,
          rangeKm: modelMap.get(c.modelId)?.rangeKm,
          limiteDailyKm: modelMap.get(c.modelId)?.limiteDailyKm,
          manufacturerCarId: modelMap.get(c.modelId)?.manufacturerCarId,
          amenitiesId: modelMap.get(c.modelId)?.amenitiesId,
          seats: modelMap.get(c.modelId)?.seats,
          price: modelMap.get(c.modelId)?.price,
          sale: modelMap.get(c.modelId)?.sale,
          image: modelMap.get(c.modelId)?.image,
        },
        status: c.status || "AVAILABLE",
        isDeleted: c.isDeleted,
      }));

      const list = groupCarEvsToCards(carEvItems);
      return { list, meta: data };
    },
  });
}
