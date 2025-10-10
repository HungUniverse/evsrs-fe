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
import { CarFront } from "lucide-react";
import clsx from "clsx";

const OPTIONS = [
  { seat: 4, label: "4 chỗ (Mini)" },
  { seat: 5, label: "5 chỗ (CUV/Sedan)" },
  { seat: 7, label: "7 chỗ (SUV/MPV)" },
];

export type SeatModalResult = { seats: number[] };

type Props = {
  children: React.ReactElement; // nút mở modal
  value?: number[]; // giá trị hiện tại (để hiển thị khi mở lại)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApply?: (values: SeatModalResult) => void; // callback trả seats
};

export default function SeatModal({
  children,
  value,
  open,
  onOpenChange,
  onApply,
}: Props) {
  const [selected, setSelected] = useState<number[]>(value ?? []);

  useEffect(() => {
    setSelected(value ?? []);
  }, [value]);

  const toggle = (seat: number) =>
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );

  const handleSubmit = () => {
    onApply?.({ seats: selected }); // trả mảng [4] / [5,7] ...
    onOpenChange?.(false); // đóng modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Loại xe</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {OPTIONS.map((o) => {
            const active = selected.includes(o.seat);
            return (
              <button
                key={o.seat}
                type="button"
                onClick={() => toggle(o.seat)}
                className={clsx(
                  "flex flex-col items-center justify-center min-h-[170px] px-8 py-6 rounded-xl border text-center transition hover:shadow-sm",
                  active
                    ? "border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white"
                )}
              >
                <CarFront
                  className={clsx(
                    "mb-3 h-8 w-8",
                    active ? "text-emerald-600" : "text-slate-500"
                  )}
                />
                <div className="font-medium leading-tight">
                  {o.label.split(" (")[0]}
                </div>
                <div className="text-sm text-slate-800 leading-tight">
                  {o.label.includes("(") ? `(${o.label.split("(")[1]}` : ""}
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Hủy
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
