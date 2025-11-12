import { useEffect, useState } from "react";
import { carEVAPI } from "@/apis/car-ev.api";
import type { CarEV } from "@/@types/car/carEv";

interface CarStats {
  total: number;
  available: number;
  inUse: number;
  reserved: number;
  repairing: number;
}

export function useCarStats() {
  const [stats, setStats] = useState<CarStats>({
    total: 0,
    available: 0,
    inUse: 0,
    reserved: 0,
    repairing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await carEVAPI.getAll({ pageNumber: 1, pageSize: 9999 });
        
        if (response.data?.items) {
          const cars = response.data.items as CarEV[];
          
          setStats({
            total: cars.length,
            available: cars.filter((car) => car.status === "AVAILABLE").length,
            inUse: cars.filter((car) => car.status === "IN_USE").length,
            reserved: cars.filter((car) => car.status === "RESERVED").length,
            repairing: cars.filter((car) => car.status === "REPAIRING").length,
          });
        }
      } catch (err) {
        console.error("Error fetching car stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

