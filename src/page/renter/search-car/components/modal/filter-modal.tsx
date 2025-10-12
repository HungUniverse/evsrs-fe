import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type Props = {
  children: React.ReactElement; // nút mở modalm
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApply?: (values: {
    priceMin: number;
    priceMax: number;
    kmLimit: number;
  }) => void;

  defaultPrice?: { min: number; max: number; step?: number };
  defaultKm?: { min: number; max: number; step?: number; value?: number };
};

const vnd = new Intl.NumberFormat("vi-VN");

export default function FilterModal({
  children,
  open,
  onOpenChange,
  onApply,
  defaultPrice = { min: 200_000, max: 2_000_000, step: 50_000 },
  defaultKm = { min: 0, max: 500, step: 10, value: 50 },
}: Props) {
  const [price, setPrice] = useState<[number, number]>([
    defaultPrice.min,
    defaultPrice.max,
  ]);
  const [kmLimit, setKmLimit] = useState<number>(
    defaultKm.value ?? defaultKm.min
  );

  const reset = () => {
    setPrice([defaultPrice.min, defaultPrice.max]);
    setKmLimit(defaultKm.value ?? defaultKm.min);
  };

  const handleApply = () => {
    const data = { priceMin: price[0], priceMax: price[1], kmLimit };
    console.log("[FilterModal] apply:", data);
    onApply?.(data);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Bộ lọc nâng cao</DialogTitle>
          <DialogDescription>Chọn mức giá và giới hạn số km.</DialogDescription>
        </DialogHeader>

        {/* Mức giá */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Mức giá</div>
            <div className="text-sm text-slate-600">
              {vnd.format(price[0])}đ — {vnd.format(price[1])}đ / ngày
            </div>
          </div>
          <Slider
            value={price}
            min={defaultPrice.min}
            max={defaultPrice.max}
            step={defaultPrice.step}
            onValueChange={(v) => setPrice([v[0], v[1]])}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{vnd.format(defaultPrice.min)}đ</span>
            <span>{vnd.format(defaultPrice.max)}đ</span>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <div className="font-medium">Giới hạn số km</div>
            <div className="text-sm text-slate-600">{kmLimit} km / ngày</div>
          </div>
          <Slider
            value={[kmLimit]}
            min={defaultKm.min}
            max={defaultKm.max}
            step={defaultKm.step}
            onValueChange={(v) => setKmLimit(v[0])}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{defaultKm.min} km</span>
            <span>{defaultKm.max} km</span>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" type="button" onClick={reset}>
            Xóa bộ lọc
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Đóng
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleApply}>
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
