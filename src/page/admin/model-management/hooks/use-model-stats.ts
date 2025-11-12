import { useEffect, useState } from "react";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV } from "@/@types/car/carEv";

interface ModelStatsData {
  totalModels: number;
  totalCars: number;
  averageCarsPerModel: number;
  modelsWithCars: number;
}

export function useModelStats(totalModels: number) {
  const [stats, setStats] = useState<ModelStatsData>({
    totalModels: 0,
    totalCars: 0,
    averageCarsPerModel: 0,
    modelsWithCars: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await carEVAPI.getAll({ pageNumber: 1, pageSize: 9999 });
        
        if (response.data?.items) {
          const cars = response.data.items as CarEV[];
          const totalCars = cars.length;
          
          // Count unique models that have cars - use model.id not modelId
          const modelIds = new Set(
            cars
              .map((car) => car.model?.id || car.modelId)
              .filter((id) => id) // Remove undefined/null
          );
          const modelsWithCars = modelIds.size;
          
          const averageCarsPerModel = totalModels > 0
            ? Math.round((totalCars / totalModels) * 10) / 10
            : 0;
          
          setStats({
            totalModels,
            totalCars,
            averageCarsPerModel,
            modelsWithCars,
          });
        } else {
          // If no car data, still show totalModels
          setStats({
            totalModels,
            totalCars: 0,
            averageCarsPerModel: 0,
            modelsWithCars: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching model stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [totalModels]);

  return { stats, loading };
}

