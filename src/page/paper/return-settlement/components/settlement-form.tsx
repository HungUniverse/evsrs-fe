import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import type { ReturnSettlementRequest } from "@/@types/order/return-settlement";
import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";
import type { HandoverInspection } from "@/@types/order/handover-inspection";

function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

type Item = { description: string; amount: string };

type Props = {
  staffDisplay: string;
  defaultSubtotal: string;
  loading?: boolean;
  onSubmit: (payload: ReturnSettlementRequest) => Promise<void> | void;
};

export default function SettlementForm({
  staffDisplay,
  defaultSubtotal,
  loading,
  onSubmit,
}: Props) {
  const { orderId } = useParams<{ orderId: string }>();

  const [handover, setHandover] = useState<HandoverInspection | null>(null);

  const [dataLoading, setDataLoading] = useState(true);

  const [odoReturn, setOdoReturn] = useState<string>("");
  const [batReturn, setBatReturn] = useState<string>("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<Item[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [newAmt, setNewAmt] = useState("");

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setDataLoading(true);
      try {
        const [h, r] = await Promise.all([
          handoverInspectionAPI.getByOrderId(orderId),
          returnInspectionAPI.getByOrderId(orderId),
        ]);

        if (Array.isArray(h)) {
          h.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setHandover(h[0] ?? null);
        } else {
          setHandover(h ?? null);
        }

        if (r) {
          setOdoReturn(r.odometer || "");
          setBatReturn(r.batteryPercent || "");
        }
      } catch {
        toast.error("Không tải được dữ liệu kiểm tra xe");
      } finally {
        setDataLoading(false);
      }
    })();
  }, [orderId]);

  const baseSubtotal = useMemo(() => toNum(defaultSubtotal), [defaultSubtotal]);
  const itemsTotal = useMemo(
    () => items.reduce((s, it) => s + toNum(it.amount), 0),
    [items]
  );
  const subtotal = baseSubtotal + itemsTotal;

  const odoHandover = toNum(handover?.odometer);
  const batHandover = toNum(handover?.batteryPercent);
  const odoDiff = toNum(odoReturn) - odoHandover;
  const batDiff = batHandover - toNum(batReturn);

  function addItem() {
    if (!newDesc.trim() || !newAmt.trim()) return;
    setItems((prev) => [
      ...prev,
      { description: newDesc.trim(), amount: newAmt },
    ]);
    setNewDesc("");
    setNewAmt("");
  }
  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    const payload: ReturnSettlementRequest = {
      subtotal: String(subtotal),
      discount: "0",
      total: String(subtotal), // 👈 thêm total theo BE
      notes: String(notes),
      settlementItems: items.map((it) => {
        const amt = String(toNum(it.amount));
        return {
          description: it.description,
          feeIncurred: amt,
          discount: "0",
          total: amt,
          notes: "",
        };
      }),
    };
    await onSubmit(payload);
  }

  if (dataLoading) {
    return (
      <section className="rounded-lg border p-4">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              Đang tải dữ liệu kiểm tra xe...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border p-4 space-y-6">
      <div className="font-semibold">Tạo biên bản thanh toán khi trả xe</div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-md border p-3 space-y-2">
          <div className="font-semibold">So sánh hiện trạng</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Odometer lúc nhận</Label>
              <Input
                className="font-medium"
                value={odoHandover || ""}
                disabled
              />
            </div>
            <div>
              <Label>Odometer lúc trả</Label>
              <Input
                value={odoReturn}
                onChange={(e) => setOdoReturn(e.target.value)}
                inputMode="numeric"
                placeholder="VD: 3456"
              />
            </div>
            <div>
              <Label>Battery (%) lúc nhận</Label>
              <Input value={batHandover || ""} disabled />
            </div>
            <div>
              <Label>Battery (%) lúc trả</Label>
              <Input
                value={batReturn}
                onChange={(e) => setBatReturn(e.target.value)}
                inputMode="numeric"
                placeholder="VD: 60"
              />
            </div>
          </div>

          <div className="text-sm text-slate-600 mt-2">
            Chênh lệch Odo: <b>{Number.isFinite(odoDiff) ? odoDiff : "—"}</b>{" "}
            km, Hao pin: <b>{Number.isFinite(batDiff) ? batDiff : "—"}</b> %
          </div>
        </div>

        <div className="rounded-md border p-3 space-y-2">
          <div className="font-medium">Tổng kết</div>
          <div className="text-sm text-slate-600">
            Nhân viên: <b>{staffDisplay}</b>
          </div>
          <div className="text-sm">
            Subtotal gốc (còn lại từ đơn):{" "}
            <b>{baseSubtotal.toLocaleString("vi-VN")}</b>
          </div>
          <div className="text-sm">
            Phát sinh: <b>{itemsTotal.toLocaleString("vi-VN")}</b>
          </div>
          <div className="text-sm">
            <span className="font-medium">Subtotal mới:</span>{" "}
            <b>{subtotal.toLocaleString("vi-VN")}</b>
          </div>
        </div>
      </div>

      <div className="rounded-md border p-3 space-y-3">
        <div className="font-medium">Thêm khoản phát sinh</div>
        <div className="grid md:grid-cols-[1fr_180px_120px] gap-3">
          <Input
            placeholder="Mô tả (VD: vệ sinh xe, phí sạc...)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <Input
            placeholder="Số tiền"
            inputMode="numeric"
            value={newAmt}
            onChange={(e) => setNewAmt(e.target.value)}
          />
          <Button onClick={addItem}>Thêm</Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(idx)}
                >
                  Xoá
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">Chưa có khoản nào</div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ghi chú</Label>
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú thêm (tuỳ chọn)"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          Lưu biên bản thanh toán
        </Button>
      </div>
    </section>
  );
}
