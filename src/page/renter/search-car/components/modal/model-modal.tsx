import { useEffect, useState } from "react";
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
export type BrandOption = {
  id: string;
  name: string;
  logoUrl?: string;
};

export type BrandModalResult = {
  manufacturerId?: string;
};

type Props = {
  children: React.ReactElement;
  options: BrandOption[];
  value?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApply?: (values: BrandModalResult) => void;
  showAll?: boolean;
};

export default function BrandModal({
  children,
  options,
  value,
  open,
  onOpenChange,
  onApply,
  showAll = true,
}: Props) {
  const [selected, setSelected] = useState<string>(value ?? "all");

  useEffect(() => {
    setSelected(value ?? "all");
  }, [value]);

  const handleSubmit = () => {
    onApply?.(
      selected === "all"
        ? { manufacturerId: undefined }
        : { manufacturerId: selected }
    );
    console.log();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Hãng xe</DialogTitle>
        </DialogHeader>

        {options.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Không có hãng nào để chọn.
          </div>
        ) : (
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
          >
            {showAll && (
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <RadioGroupItem value="all" id="brand-all" />
                <span className="font-medium">Tất cả</span>
              </label>
            )}

            {options.map((o) => {
              const id = `brand-${o.id}`;
              const first = o.name?.trim()?.[0]?.toUpperCase() ?? "?";
              return (
                <label
                  key={o.id}
                  htmlFor={id}
                  className="flex items-center gap-2 py-2 cursor-pointer rounded-md hover:bg-slate-50"
                >
                  <RadioGroupItem value={o.id} id={id} />
                  {o.logoUrl ? (
                    <img
                      src={o.logoUrl}
                      alt={o.name}
                      className="h-5 w-auto shrink-0"
                    />
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-[10px]">
                      {first}
                    </span>
                  )}
                  <span className="font-medium">{o.name}</span>
                </label>
              );
            })}
          </RadioGroup>
        )}

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
