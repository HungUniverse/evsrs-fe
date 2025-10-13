import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ReturnSettlementRequest,
  ReturnSettlementItemRequest,
} from "@/@types/order/return-settlement";

function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function SettlementForm({
  defaultSubtotal = "0",
  staffDisplay,
  onSubmit,
  loading,
}: {
  defaultSubtotal?: string;
  staffDisplay: string;
  loading?: boolean;
  onSubmit: (payload: ReturnSettlementRequest) => void;
}) {
  const [subtotal, setSubtotal] = useState(defaultSubtotal);
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<ReturnSettlementItemRequest[]>([
    { feeIncurred: "0", description: "", discount: "0", total: "0", notes: "" },
  ]);

  function updateItem(i: number, patch: Partial<ReturnSettlementItemRequest>) {
    setItems((prev) => {
      const next = [...prev];
      const it = { ...next[i], ...patch };
      const fee = toNum(it.feeIncurred);
      const disc = toNum(it.discount);
      const auto = Math.max(fee - disc, 0);
      it.total = String(toNum(it.total) || auto);
      next[i] = it;
      return next;
    });
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        feeIncurred: "0",
        description: "",
        discount: "0",
        total: "0",
        notes: "",
      },
    ]);
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  const sumItems = useMemo(
    () =>
      items.reduce(
        (s, it) => s + toNum(it.total || it.feeIncurred) - toNum(it.discount),
        0
      ),
    [items]
  );
  const grandTotal = useMemo(
    () => Math.max(toNum(subtotal) + sumItems - toNum(discount), 0),
    [subtotal, sumItems, discount]
  );

  function handleSubmit() {
    onSubmit({
      orderBookingId: "", // sẽ điền ở page
      subtotal: String(toNum(subtotal)),
      discount: String(toNum(discount)),
      total: String(grandTotal),
      notes,
      settlementItems: items.map((it) => ({
        ...it,
        feeIncurred: String(toNum(it.feeIncurred)),
        discount: String(toNum(it.discount)),
        total: String(toNum(it.total || it.feeIncurred)),
      })),
    });
  }

  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">Tính phí khi trả xe</div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Subtotal (còn lại phải trả)</Label>
          <Input
            value={subtotal}
            onChange={(e) => setSubtotal(e.target.value)}
            inputMode="numeric"
          />
        </div>
        <div className="space-y-2">
          <Label>Giảm giá (tổng)</Label>
          <Input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            inputMode="numeric"
          />
        </div>
        <div className="space-y-2">
          <Label>Nhân viên thực hiện</Label>
          <Input value={staffDisplay} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Các khoản phát sinh</Label>
        <div className="rounded-md border divide-y">
          {items.map((it, i) => (
            <div key={i} className="grid md:grid-cols-5 gap-2 p-3">
              <Input
                placeholder="Mô tả"
                value={it.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
              />
              <Input
                placeholder="Phí phát sinh"
                inputMode="numeric"
                value={it.feeIncurred}
                onChange={(e) => updateItem(i, { feeIncurred: e.target.value })}
              />
              <Input
                placeholder="Giảm"
                inputMode="numeric"
                value={it.discount}
                onChange={(e) => updateItem(i, { discount: e.target.value })}
              />
              <Input
                placeholder="Tổng"
                inputMode="numeric"
                value={it.total}
                onChange={(e) => updateItem(i, { total: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Ghi chú"
                  value={it.notes}
                  onChange={(e) => updateItem(i, { notes: e.target.value })}
                />
                <Button
                  variant="destructive"
                  onClick={() => removeItem(i)}
                  disabled={items.length <= 1}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={addItem}>
            + Thêm khoản
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú chung..."
        />
      </div>

      <div className="text-right text-sm">
        <div>
          Tổng các khoản: <span className="font-semibold">{sumItems}</span>
        </div>
        <div className="text-lg">
          Tổng thanh toán: <span className="font-bold">{grandTotal}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang lưu..." : "Tạo biên bản thanh toán"}
        </Button>
      </div>
    </section>
  );
}
