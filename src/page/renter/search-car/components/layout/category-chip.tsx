import { Button } from "@/components/ui/button";
import { Car, Globe, BadgePercent, SlidersHorizontal } from "lucide-react";

import { useState } from "react";
import SeatModal from "../modal/seat-modal";
import BrandModal from "../modal/model-modal";
import FilterModal from "../modal/filter-modal";
type Props = {
  onSeatFilter?: (seat: number[]) => void;
  onPriceFilter?: (min: number, max: number) => void;
  onBrandFilter?: (brand?: string) => void; // undefined = bỏ filter
  onSaleFilter?: (hasSale: boolean) => void; // true = chỉ xe có giảm
};

export default function CategoryChip({
  onSeatFilter,
  onPriceFilter,
  onBrandFilter,
  onSaleFilter,
}: Props) {
  const base = "rounded-md px-8 py-6 text-md";
  const [openModel, setOpenModel] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openSeat, setOpenSeat] = useState(false);
  const [saleActive, setSaleActive] = useState(false);

  return (
    <div className="flex flex-wrap justify-center mt-5 mx-auto gap-7">
      {/* Hãng xe */}
      <BrandModal
        open={openModel}
        onOpenChange={setOpenModel}
        onApply={({ brand }) => {
          // brand === "all" thì clear filter
          onBrandFilter?.(brand === "all" ? undefined : brand);
        }}
      >
        <Button variant="outline" className={base}>
          <Car className="w-4 h-4 mr-2" />
          Hãng xe
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

      {/* Giảm giá: toggle có/không */}
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

      {/* Bộ lọc nâng cao (giá + km) */}
      <FilterModal
        open={openFilter}
        onOpenChange={setOpenFilter}
        onApply={({ priceMin, priceMax }) => {
          onPriceFilter?.(priceMin, priceMax);
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
