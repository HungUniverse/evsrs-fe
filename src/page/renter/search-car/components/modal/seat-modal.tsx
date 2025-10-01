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
import { CarFront } from "lucide-react";
import clsx from "clsx";

const OPTIONS = [
  { seat: 4, label: "4 chỗ (Mini)", count: 197 },
  { seat: 5, label: "5 chỗ (CUV/Sedan)", count: 148 },
  { seat: 7, label: "7 chỗ (SUV/MPV)", count: 129 },
];
function splitLabel(label: string) {
  const m = label.match(/^\s*([^()]+?)\s*\(([^)]+)\)\s*$/);
  if (m) return { main: m[1].trim(), desc: m[2].trim() };
  return { main: label.trim(), desc: null as string | null };
}
//tach option ra

export type SeatModalResult = { seats: number[] };

type Props = {
  children: React.ReactElement; // nút mở modal
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApply?: (values: SeatModalResult) => void; //callback
};

export default function SeatModal({
  children,
  open,
  onOpenChange,
  onApply,
}: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  // toggle chon bo?
  const toggle = (seat: number) => {
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleSubmit = () => {
    console.log("Lua chon: ", { seat: selected });
    onApply?.({ seats: selected });
    onOpenChange?.(false); // đóng modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[900px] ">
        <DialogHeader>
          <DialogTitle>Loại xe</DialogTitle>
        </DialogHeader>

        {/* danh sách 4 button: 4, 5, 6, 7 chỗ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {OPTIONS.map((o) => {
            const active = selected.includes(o.seat);
            const { main, desc } = splitLabel(o.label);

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
                <div className="font-medium leading-tight">{main}</div>
                {desc && (
                  <div className="text-sm text-slate-800 leading-tight">
                    ({desc})
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-1">{o.count} xe</div>
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
