import type { ForecastResponse } from "@/@types/forecast";
import { api } from "@/lib/axios/axios";

export const forecastAIAPI = {
  getForecastByStationId: async (stationId: string) => {
    const response = await api.get<ForecastResponse>(
      `/api/forecast/${stationId}`
    );
    return response.data;
  },
};
