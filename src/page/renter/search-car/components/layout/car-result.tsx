import type { Car } from "@/@types/car";
import { mockCars } from "@/mockdata/mock-car";
import CarCard from "./car-card";

export type Filters = {
  seat?: number[];
  minPrice?: number;
  maxPrice?: number;
  model?: string;
  province?: string;
  sale?: boolean;
  dailyKmLimit?: number;
};
type Props = {
  filters: Filters;
};
export default function CarResult({ filters }: Props) {
  let cars: Car[] = [...mockCars];

  if (filters.seat?.length) {
    cars = cars.filter((c) => filters.seat!.includes(c.seats));
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    cars = cars.filter((c) => {
      const price = c.pricePerDay;
      const minOk =
        filters.minPrice !== undefined ? price >= filters.minPrice : true;
      const maxOk =
        filters.maxPrice !== undefined ? price <= filters.maxPrice : true;
      return minOk && maxOk;
    });
  }
  if (filters.model) {
    cars = cars.filter((c) =>
      c.model.toLocaleLowerCase().includes(filters.model!.toLocaleLowerCase())
    );
  }

  if (filters.province) {
    cars = cars.filter((c) => c.province === filters.province);
  }
  if (filters.sale !== undefined) {
    cars = cars.filter((c) => {
      const d = c.discount ?? 0;
      return filters.sale ? d > 0 : d === 0;
    });
  }
  if (filters.dailyKmLimit !== undefined) {
    cars = cars.filter((c) => (c.dailyKmLimit ?? 0) >= filters.dailyKmLimit!);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.length > 0 ? (
        cars.map((c) => <CarCard key={c.id} car={c} />)
      ) : (
        <div className="col-span-full text-center py-10 text-slate-500">
          Không tìm thấy xe phù hợp
        </div>
      )}
    </div>
  );
}
