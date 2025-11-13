import { useState, useEffect, useCallback } from "react";
import { forecastAIAPI } from "@/apis/forecast-ai.api";
import { modelAPI } from "@/apis/model-ev.api";
import type { ForecastResponse, ForecastRecommendation } from "@/@types/forecast";
import { toast } from "sonner";

export interface EnrichedRecommendation extends ForecastRecommendation {
  modelName?: string;
}

export function useForecast(depotId: string, open: boolean) {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [recommendations, setRecommendations] = useState<EnrichedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await forecastAIAPI.getForecastByStationId(depotId);
      setForecast(response);

      // Enrich with model names
      const enriched = await Promise.all(
        response.recommendations.map(async (rec: ForecastRecommendation) => {
          try {
            const model = await modelAPI.getById(rec.vehicleType);
            return {
              ...rec,
              modelName: model.modelName,
            };
          } catch (err) {
            console.error("Error fetching model:", err);
            return rec;
          }
        })
      );

      setRecommendations(enriched);
    } catch (err) {
      console.error("Error fetching forecast:", err);
      setError("Không thể tải dự báo AI. Vui lòng thử lại sau.");
      toast.error("Không thể tải dự báo AI");
    } finally {
      setLoading(false);
    }
  }, [depotId]);

  useEffect(() => {
    if (open && depotId) {
      // Reset state when opening dialog for a different depot
      setForecast(null);
      setRecommendations([]);
      fetchForecast();
    }
  }, [open, depotId, fetchForecast]);

  return { forecast, recommendations, loading, error };
}

