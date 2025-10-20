import { Link } from "react-router-dom";
import { vnd } from "@/lib/utils/currency";
import type { CarCardVM } from "@/hooks/to-car-card";

type Props = {
  car: CarCardVM;
  searchForm: { location: string; start: string; end: string };
};

export default function CarCard({ car, searchForm }: Props) {
  const hasSale = !!car.discount && car.discount > 0;
  const finalPrice = hasSale
    ? Math.round(car.pricePerDay * (1 - (car.discount ?? 0) / 100))
    : car.pricePerDay;

  return (
    <Link
      to={`/book-car/${car.modelId}`}
      state={{
        modelId: car.modelId,
        province: car.province || searchForm.location || undefined,
        start: searchForm.start,
        end: searchForm.end,
        searchForm,
      }}
      className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <img
        src={car.image || "/placeholder-car.jpg"}
        alt={car.modelName}
        className="w-full h-56 md:h-60 object-cover rounded-t-2xl"
      />

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-base md:text-lg font-semibold line-clamp-1">
          {car.modelName}
        </h3>

        {hasSale ? (
          <div className="text-sm md:text-base">
            <span className="line-through text-slate-400 mr-2">
              {vnd(car.pricePerDay)} đ
            </span>
            <span className="text-emerald-600 font-semibold">
              {vnd(finalPrice)} đ/ngày
            </span>
            <span className="ml-2 text-xs md:text-sm text-red-500">
              -{car.discount}%
            </span>
          </div>
        ) : (
          <div className="text-sm md:text-base font-semibold text-emerald-700">
            {vnd(car.pricePerDay)} đ/ngày
          </div>
        )}

        <p className="text-xs md:text-sm text-slate-500">{car.seats} chỗ</p>

        {car.dailyKmLimit && (
          <p className="text-xs text-slate-400">
            Giới hạn {car.dailyKmLimit} km/ngày
          </p>
        )}

        {car.availableCount !== undefined && (
          <p className="text-xs text-emerald-600">
            Còn {car.availableCount} xe
          </p>
        )}
      </div>
    </Link>
  );
}
