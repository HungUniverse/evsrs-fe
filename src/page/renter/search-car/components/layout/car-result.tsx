import type { Car } from "@/@types/car";
import { mockCars } from "@/mockdata/mock-car";

type Filters = {
  seat?: number[];
  minPrice?: number;
  maxPrice?: number;
  model?: string;
  province?: string;
  sale?: boolean;
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
  return (
    <div
      className="max-w-7xl mx-auto px-4 mt-8
                  grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {cars.length > 0 ? (
        cars.map((c) => {
          const hasSale = (c.discount ?? 0) > 0;
          const finalPrice = hasSale
            ? c.pricePerDay * (1 - (c.discount ?? 0) / 100)
            : c.pricePerDay;

          return (
            <div
              key={c.id}
              className="flex flex-col h-full rounded-2xl border border-slate-200
                       bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-56 md:h-60 object-cover rounded-t-2xl"
                // hoặc dùng tỷ lệ cố định:
                // className="w-full aspect-[4/3] object-cover rounded-t-2xl"
              />

              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-base md:text-lg font-semibold">{c.name}</h3>

                {hasSale ? (
                  <div className="text-sm md:text-base">
                    <span className="line-through text-slate-400 mr-2">
                      {c.pricePerDay.toLocaleString()} đ
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {finalPrice.toLocaleString()} đ/ngày
                    </span>
                    <span className="ml-2 text-xs md:text-sm text-red-500">
                      -{c.discount}%
                    </span>
                  </div>
                ) : (
                  <div className="text-sm md:text-base font-semibold">
                    {c.pricePerDay.toLocaleString()} đ/ngày
                  </div>
                )}

                <p className="text-xs md:text-sm text-slate-500">
                  {c.seats} chỗ • {c.province}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-10 text-slate-500">
          Không tìm thấy xe phù hợp
        </div>
      )}
    </div>
  );
}
