import { useState } from "react";
import CarResult from "./components/layout/car-result";
import CategoryChip from "./components/layout/category-chip";
import SearchBar from "./components/layout/search-bar";
import HeaderLite from "../components/layout/headerLite";
import type { Filters } from "./components/layout/car-result";

export default function SearchCar() {
  const [filters, setFilters] = useState<Filters>({});
  return (
    <>
      <HeaderLite />
      <SearchBar
        onSearch={(f) => {
          setFilters((prev) => ({ ...prev, province: f.location }));
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
        onBrandFilter={(brand) =>
          setFilters((prev) => ({ ...prev, model: brand }))
        }
        onSaleFilter={(hasSale) =>
          setFilters((prev) => ({ ...prev, sale: hasSale }))
        }
        onDailyKmFilter={(km) =>
          setFilters((prev) => ({ ...prev, dailyKmLimit: km }))
        }
      />
      <CarResult filters={filters} />
    </>
  );
}
