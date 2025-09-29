import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { logoCar } from "@/images/logoCar/logoCar";

type BrandOption = { model: string; count: number };

const RAW_OPTIONS: BrandOption[] = [
  { model: "Honda", count: 10 },
  { model: "Vinfast", count: 92 },
  { model: "Toyota", count: 50 },
  { model: "Chevrolet", count: 31 },
  { model: "Hyundai", count: 22 },
  { model: "Kia", count: 29 },
];

// Gộp các hãng trùng tên
function aggregateOptions(options: BrandOption[]): BrandOption[] {
  const map = new Map<string, number>();
  for (const o of options) {
    map.set(o.model, (map.get(o.model) ?? 0) + o.count);
  }
  return [...map.entries()].map(([model, count]) => ({ model, count }));
}

export type BrandModalResult = { brand: string };

type Props = {
  children: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApply?: (values: BrandModalResult) => void;
};

export default function BrandModal({
  children,
  open,
  onOpenChange,
  onApply,
}: Props) {
  const OPTIONS = aggregateOptions(RAW_OPTIONS);
  const total = OPTIONS.reduce((s, o) => s + o.count, 0);

  const [brand, setBrand] = useState<string>("all");

  const handleSubmit = () => {
    console.log("Lựa chọn hãng:", brand);
    onApply?.({ brand });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Hãng xe</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={brand}
          onValueChange={setBrand}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
        >
          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <RadioGroupItem value="all" id="brand-all" />
            <span className="font-medium">Tất cả</span>
            <span className="ml-2 text-sm text-slate-500">({total} xe)</span>
          </label>

          {OPTIONS.map((o) => {
            const id = `brand-${o.model}`;
            const src = logoCar[o.model];
            return (
              <label
                key={o.model}
                htmlFor={id}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                <RadioGroupItem value={o.model} id={id} />
                {src ? (
                  <img
                    src={src}
                    alt={o.model}
                    className="h-5 w-auto shrink-0"
                  />
                ) : (
                  <span className="inline-block h-6 w-6" />
                )}
                <span className="font-medium">{o.model}</span>
                <span className="ml-2 text-md text-slate-500">
                  ({o.count} xe)
                </span>
              </label>
            );
          })}
        </RadioGroup>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="w-full md:w-auto"
            onClick={handleSubmit}
          >
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
