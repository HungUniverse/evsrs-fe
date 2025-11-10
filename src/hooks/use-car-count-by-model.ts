import { useState, useEffect } from "react";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV } from "@/@types/car/carEv";

interface UseCarCountByModelOptions {
  depotId?: string;
}

export function useCarCountByModel(options: UseCarCountByModelOptions = {}) {
  const { depotId } = options;
  const [carCountMap, setCarCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarCounts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API với pageSize lớn để lấy tất cả xe (không có pagination thực sự)
        const response = await carEVAPI.getAll({ pageNumber: 1, pageSize: 9999 });
        
        // Đếm số lượng xe theo modelId
        const countMap: Record<string, number> = {};
        
        let items = response.data?.items || [];
        
        // Filter by depot if depotId is provided
        if (depotId && items.length > 0) {
          items = items.filter((car: CarEV) => {
            const carDepotId = car.depot?.id || car.depotId;
            return String(carDepotId) === depotId;
          });
        }
        
        if (items.length > 0) {
          items.forEach((car: CarEV) => {
            // API trả về model object, không phải modelId trực tiếp
            const modelId = car.model?.id || car.modelId;
            if (modelId) {
              countMap[modelId] = (countMap[modelId] || 0) + 1;
            }
          });
        }
        
        setCarCountMap(countMap);
      } catch (err) {
        console.error("Error fetching car counts:", err);
        setError("Không thể tải thống kê xe");
      } finally {
        setLoading(false);
      }
    };

    fetchCarCounts();
  }, [depotId]);

  const getCarCount = (modelId: string): number => {
    return carCountMap[modelId] || 0;
  };

  return {
    carCountMap,
    getCarCount,
    loading,
    error,
  };
}

