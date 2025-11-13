import { useQuery } from "@tanstack/react-query";
import { CarManufactureAPI } from "@/apis/manufacture.api";
import { AmenityAPI } from "@/apis/amentities.api";
import type { CarManufacture } from "@/@types/car/carManufacture";
import type { Amenity } from "@/@types/car/amentities";
import type { ListBaseResponse } from "@/@types/response";

export function useModelDropdowns() {
  const manufacturersQuery = useQuery({
    queryKey: ["car-manufactures", "dropdown"],
    queryFn: async () => {
      const res = await CarManufactureAPI.getAll(1, 1000);
      const payload = res.data as ListBaseResponse<CarManufacture>;
      return payload.data.items || [];
    },
  });

  const amenitiesQuery = useQuery({
    queryKey: ["amenities", "dropdown"],
    queryFn: async () => {
      const res = await AmenityAPI.getAll(1, 1000);
      const payload = res.data as ListBaseResponse<Amenity>;
      return payload.data.items || [];
    },
  });

  return {
    manufacturers: manufacturersQuery.data || [],
    amenities: amenitiesQuery.data || [],
    isLoading: manufacturersQuery.isLoading || amenitiesQuery.isLoading,
  };
}

