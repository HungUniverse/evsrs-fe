import { Link } from "react-router-dom";
import type { Car } from "@/@types/car";
import { vnd } from "@/lib/utils/currency";
type Props = {
  car: Car;
  searchForm: { location: string; start: string; end: string };
};

export default function CarCard({ car, searchForm }: Props) {
  const hasSale = (car.discount ?? 0) > 0;
  const finalPrice = hasSale
    ? Math.round(car.pricePerDay * (1 - (car.discount ?? 0) / 100))
    : car.pricePerDay;

  return (
    <Link
      to={`/book-car/${car.id}`}
      state={{
        car,
        province: searchForm.location,
        start: searchForm.start,
        end: searchForm.end,
      }}
      className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white
                 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <img
        src={car.image}
        alt={car.name}
        className="w-full h-56 md:h-60 object-cover rounded-t-2xl"
      />

      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-base md:text-lg font-semibold">{car.name}</h3>

        {hasSale ? (
          <div className="text-sm md:text-base">
            <span className="line-through text-slate-400 mr-2">
              {vnd(car.pricePerDay)} đ
            </span>
            <span className="text-emerald-600 font-semibold">
              {vnd(finalPrice)}đ/ngày
            </span>
            <span className="ml-2 text-xs md:text-sm text-red-500">
              -{car.discount}%
            </span>
          </div>
        ) : (
          <div className="text-sm md:text-base font-semibold">
            {vnd(car.pricePerDay)} đ/ngày
          </div>
        )}

        <p className="text-xs md:text-sm text-slate-500">
          {car.seats} chỗ • {car.province}
        </p>
      </div>
    </Link>
  );
}
