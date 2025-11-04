import { useState } from "react";
import CarResult from "./components/layout/car-result";
import CategoryChip from "./components/layout/category-chip";
import SearchBar from "./components/layout/search-bar";
import type { Filters } from "./components/layout/car-result";

function toLocalDatetimeValue(d = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function SearchCar() {
  const initialSearchForm = {
    location: "TP. Hồ Chí Minh",
    start: toLocalDatetimeValue(new Date(Date.now() + 60 * 60 * 1000)),
    end: toLocalDatetimeValue(new Date(Date.now() + 25 * 60 * 60 * 1000)),
  };

  const [filters, setFilters] = useState<Filters>({
    province: "TP. Hồ Chí Minh",
  });
  const [searchForm, setSearchForm] = useState(initialSearchForm);

  return (
    <>
      <SearchBar
        onSearch={(f) => {
          setFilters((prev) => ({ ...prev, province: f.location }));
          setSearchForm(f);
        }}
      />
      <CategoryChip
        onSeatFilter={(seat) =>
          setFilters((prev) => ({
            ...prev,
            seat: seat.length ? seat : undefined,
          }))
        }
        onPriceFilter={(min, max) =>
          setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
        }
        onBrandFilter={(id) =>
          setFilters((prev) => ({ ...prev, manufacture: id ?? undefined }))
        }
        onSaleFilter={(hasSale) =>
          setFilters((prev) => ({ ...prev, sale: hasSale }))
        }
        onDailyKmFilter={(km) =>
          setFilters((prev) => ({ ...prev, dailyKmLimit: km }))
        }
      />
      <CarResult filters={filters} searchForm={searchForm} />
    </>
  );
}
