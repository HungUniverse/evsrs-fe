import { Button } from "@/components/ui/button";
import { Globe, BadgePercent, SlidersHorizontal, CarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import SeatModal from "../modal/seat-modal";
import FilterModal from "../modal/filter-modal";
import { useManufactures } from "@/hooks/use-manufature";
import BrandModal from "../modal/model-modal";

type Props = {
  onSeatFilter?: (seat: number[]) => void;
  onPriceFilter?: (min: number, max: number) => void;
  onBrandFilter?: (manufacturerId?: string) => void;
  onSaleFilter?: (hasSale: boolean) => void;
  onDailyKmFilter?: (dailyKm: number) => void;
};

export default function CategoryChip({
  onSeatFilter,
  onPriceFilter,
  onBrandFilter,
  onSaleFilter,
  onDailyKmFilter,
}: Props) {
  const base = "rounded-md px-8 py-6 text-md";
  const [openModel, setOpenModel] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openSeat, setOpenSeat] = useState(false);
  const [saleActive, setSaleActive] = useState(false);

  const { map: manuMap, list: brands } = useManufactures();
  const [manufacturerId, setManufacturerId] = useState<string | undefined>();

  const brandLabel = useMemo(() => {
    if (!manufacturerId) return "Hãng xe";
    const found = manuMap.get(manufacturerId);
    return found
      ? ((found as any).name ?? (found as any).manufacturerName ?? "Hãng xe")
      : "Hãng xe";
  }, [manufacturerId, manuMap]);

  return (
    <div className="flex flex-wrap justify-center mt-5 mx-auto gap-7">
      <BrandModal
        open={openModel}
        onOpenChange={setOpenModel}
        options={brands}
        value={manufacturerId}
        onApply={({ manufacturerId: id }) => {
          setManufacturerId(id);
          onBrandFilter?.(id);
        }}
      >
        <Button
          variant="outline"
          className={base}
          onClick={() => setOpenModel(true)}
        >
          <CarIcon className="w-4 h-4 mr-2" />
          {brandLabel}
        </Button>
      </BrandModal>

      {/* Loại xe (số chỗ) */}
      <SeatModal
        open={openSeat}
        onOpenChange={setOpenSeat}
        onApply={({ seats }) => onSeatFilter?.(seats)}
      >
        <Button
          variant="outline"
          className={base}
          onClick={() => setOpenSeat(true)}
        >
          <Globe className="w-4 h-4 mr-2" />
          Loại xe
        </Button>
      </SeatModal>

      {/* Giảm giá toggle */}
      <Button
        variant={saleActive ? "default" : "outline"}
        className={base}
        onClick={() => {
          const next = !saleActive;
          setSaleActive(next);
          onSaleFilter?.(next);
        }}
      >
        <BadgePercent className="mr-2" />
        Giảm giá
      </Button>

      {/* Bộ lọc nâng cao */}
      <FilterModal
        open={openFilter}
        onOpenChange={setOpenFilter}
        onApply={({ priceMin, priceMax, kmLimit }) => {
          onPriceFilter?.(priceMin, priceMax);
          if (kmLimit !== undefined) onDailyKmFilter?.(kmLimit);
        }}
      >
        <Button
          variant="outline"
          className={base}
          onClick={() => setOpenFilter(true)}
        >
          <SlidersHorizontal className="mr-2" />
          Bộ lọc
        </Button>
      </FilterModal>
    </div>
  );
}
