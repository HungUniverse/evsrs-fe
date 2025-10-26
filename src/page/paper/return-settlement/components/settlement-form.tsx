import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import type { ReturnSettlementRequest } from "@/@types/order/return-settlement";
import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";
import type { HandoverInspection } from "@/@types/order/handover-inspection";
import type { Item } from "./form-compos/extra-item";
import { useAutoFees } from "./form-compos/use-auto-fee";
import StatusCompare from "./form-compos/status-compare";
import FeesSummary from "./form-compos/fee-sumary";
import ExtraItems from "./form-compos/extra-item";

function toNum(v: string | number | null | undefined) {
  const n = Number(String(v ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

type Props = {
  staffDisplay: string;
  defaultSubtotal: string;
  limitDailyKm?: number | string | null;
  overageFee?: number;
  startAt?: string | null;
  endAt?: string | null;
  loading?: boolean;
  onSubmit: (payload: ReturnSettlementRequest) => Promise<void> | void;
};

export default function SettlementForm({
  staffDisplay,
  defaultSubtotal,
  limitDailyKm,
  overageFee,
  startAt,
  endAt,
  loading,
  onSubmit,
}: Props) {
  const { orderId } = useParams<{ orderId: string }>();

  const [handover, setHandover] = useState<HandoverInspection | null>(null);
  const [odoReturn, setOdoReturn] = useState("");
  const [batReturn, setBatReturn] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoadingData(true);
      try {
        const [h, r] = await Promise.all([
          handoverInspectionAPI.getByOrderId(orderId),
          returnInspectionAPI.getByOrderId(orderId),
        ]);
        const hand = Array.isArray(h)
          ? h.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]
          : h;
        setHandover(hand ?? null);
        if (r) {
          setOdoReturn(r.odometer || "");
          setBatReturn(r.batteryPercent || "");
        }
      } catch {
        toast.error("Không tải được dữ liệu kiểm tra xe");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [orderId]);

  const baseSubtotal = useMemo(() => toNum(defaultSubtotal), [defaultSubtotal]);

  const auto = useAutoFees({
    odoReceive: handover?.odometer,
    batReceive: handover?.batteryPercent,
    odoReturn,
    batReturn,
    limitDailyKm,
    startAt,
    endAt,
    ratePerKm: overageFee,
  });

  const itemsTotal = useMemo(
    () => items.reduce((s, it) => s + toNum(it.amount), 0),
    [items]
  );
  const subtotal = baseSubtotal + auto.autoFeesTotal + itemsTotal;

  async function handleSubmit() {
    const payload: ReturnSettlementRequest = {
      subtotal: String(subtotal),
      discount: "0",
      total: String(subtotal),
      notes: String(notes),
      settlementItems: items.map((it) => {
        const amt = String(toNum(it.amount));
        return {
          description: it.description,
          feeIncurred: amt,
          discount: "0",
          total: amt,
          image: it.image || "",
          notes: "",
        };
      }),
    };
    await onSubmit(payload);
  }

  if (loadingData) {
    return (
      <section className="rounded-lg border p-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border p-4 space-y-6">
      <div className="font-semibold">Tạo biên bản thanh toán khi trả xe</div>

      <div className="grid md:grid-cols-2 gap-4">
        <StatusCompare
          odoReceive={toNum(handover?.odometer)}
          batReceive={toNum(handover?.batteryPercent)}
          odoReturn={odoReturn}
          batReturn={batReturn}
          setOdoReturn={setOdoReturn}
          setBatReturn={setBatReturn}
          odoDiff={auto.odoDiff}
          batDiff={auto.batDiff}
          permittedKm={auto.permittedKm}
          days={auto.days}
          dailyLimit={auto.daily}
        />

        <FeesSummary
          staffDisplay={staffDisplay}
          baseSubtotal={baseSubtotal}
          itemsTotal={itemsTotal}
          overKmFee={auto.overKmFee}
          exceededKm={auto.exceededKm}
          ratePerKm={auto.ratePerKm}
          subtotal={subtotal}
        />
      </div>

      <ExtraItems
        items={items}
        onAdd={(it) => setItems((prev) => [...prev, it])}
        onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
      />

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
        <Button variant="outline" onClick={handleSubmit} disabled={loading}>
          Lưu biên bản thanh toán
        </Button>
      </div>
    </section>
  );
}
