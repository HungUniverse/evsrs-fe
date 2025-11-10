import { useState, useEffect } from "react";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV } from "@/@types/car/carEv";

export function useCarCountByModel() {
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
        
        const items = response.data?.items || [];
        
        if (items && items.length > 0) {
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
  }, []);

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

