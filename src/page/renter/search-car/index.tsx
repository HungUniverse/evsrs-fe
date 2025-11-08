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

// Làm tròn lên 30 phút và cộng thêm 1 giờ, đảm bảo trong khung 6h-22h
function getRoundedStartTime() {
  const now = new Date();
  let minutes = now.getMinutes();
  let hours = now.getHours();

  // Làm tròn lên 30 phút
  if (minutes > 30) {
    hours += 1;
    minutes = 0;
  } else if (minutes > 0) {
    minutes = 30;
  }

  // Cộng thêm 1 giờ
  hours += 1;

  // Xử lý overflow ngày
  if (hours >= 24) {
    now.setDate(now.getDate() + 1);
    hours = hours % 24;
  }

  // Kiểm tra giờ làm việc (6h-22h)
  if (hours < 6) {
    hours = 6;
    minutes = 0;
  } else if (hours >= 22) {
    // Nếu >= 22h, set sang 6h sáng hôm sau
    now.setDate(now.getDate() + 1);
    hours = 6;
    minutes = 0;
  }

  now.setHours(hours, minutes, 0, 0);
  return now;
}

// End time = start time + 24h, đảm bảo trong khung 6h-22h
function getRoundedEndTime(startTime: Date) {
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 24);

  const hours = endTime.getHours();

  // Nếu end time vượt quá 22h, điều chỉnh về 22h cùng ngày
  if (hours > 22 || hours < 6) {
    endTime.setHours(22, 0, 0, 0);
  }

  return endTime;
}

export default function SearchCar() {
  const startTime = getRoundedStartTime();
  const endTime = getRoundedEndTime(startTime);

  const initialSearchForm = {
    location: "TP. Hồ Chí Minh",
    start: toLocalDatetimeValue(startTime),
    end: toLocalDatetimeValue(endTime),
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
