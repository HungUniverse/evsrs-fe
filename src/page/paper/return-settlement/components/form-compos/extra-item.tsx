import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

function toNum(v: string) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export type Item = { description: string; amount: string };

type Props = {
  items: Item[];
  onAdd: (it: Item) => void;
  onRemove: (i: number) => void;
};

export default function ExtraItems({ items, onAdd, onRemove }: Props) {
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [quick, setQuick] = useState("");

  function handleSelect(v: string) {
    setQuick(v);
    if (v === "battery-fee") setDesc("Phí pin");
    else if (v === "cleaning") setDesc("Phí vệ sinh");
    else if (v === "other-depot") setDesc("Phí trả khác trạm");
    else if (v === "highway") setDesc("Phí cao tốc");
    else if (v === "other-fee") setDesc("Phí khác");
    else setDesc("");
  }

  function add() {
    if (!desc.trim() || !amt.trim()) return;
    onAdd({ description: desc.trim(), amount: amt });
    setDesc("");
    setAmt("");
    setQuick("");
  }

  const itemsTotal = items.reduce((s, it) => s + toNum(it.amount), 0);

  return (
    <div className="rounded-md border p-3 space-y-3">
      <div className="font-medium">Thêm khoản phát sinh</div>

      <div className="grid md:grid-cols-[220px_1fr_180px_120px] gap-3">
        <Select value={quick} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhanh khoản phí" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="battery-fee">Phí pin</SelectItem>
            <SelectItem value="cleaning">Phí vệ sinh</SelectItem>
            <SelectItem value="other-depot">Phí trả khác trạm</SelectItem>
            <SelectItem value="highway">Phí cao tốc</SelectItem>
            <SelectItem value="other-fee">Phí khác</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Mô tả (VD: vệ sinh xe, phí sạc...)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Input
          placeholder="Số tiền"
          inputMode="numeric"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
        />
        <Button onClick={add}>Thêm</Button>
      </div>

      {items.length ? (
        <div className="divide-y">
          {items.map((it, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{it.description}</div>
                <div className="text-sm text-slate-600">
                  {toNum(it.amount).toLocaleString("vi-VN")} đ
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onRemove(idx)}>
                Xoá
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">Chưa có khoản nào</div>
      )}

      <div className="text-xs text-slate-500">
        Tổng phát sinh khác: {itemsTotal.toLocaleString("vi-VN")} đ
      </div>
    </div>
  );
}
