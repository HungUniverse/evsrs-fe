import { api } from "@/lib/axios/axios";
import type { CapacityAdviceResponse } from "@/@types/capacity";

export const capacityAIAPI = {
    getCapacityAdvice: async () => {
        const response = await api.get<CapacityAdviceResponse>(
            "/api/capacity/advice"
        );
        return response.data;
    }
}