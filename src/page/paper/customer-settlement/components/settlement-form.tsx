import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import type { HandoverInspection } from "@/@types/order/handover-inspection";

type Props = {
  staffDisplay: string;
  order: OrderBookingDetail;
  onSubmit: (inspection: HandoverInspection) => Promise<void> | void;
};

export default function SettlementForm({
  staffDisplay,
  order,
  onSubmit,
}: Props) {
  const { orderId } = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(false);

  const [odometer, setOdometer] = useState("");
  const [battery, setBattery] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    try {
      setLoading(true);
      const inspection = await handoverInspectionAPI.create({
        orderBookingId: orderId,
        type: "HANDOVER",
        batteryPercent: battery,
        odometer: odometer,
        images: "",
        notes: notes,
        staffId: order.userId,
      });

      await onSubmit(inspection);
      toast.success("Đã lưu thông tin thanh toán");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu thông tin thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg">
      <div>
        <Label htmlFor="odometer">Số công tơ mét (km)</Label>
        <Input
          id="odometer"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
          placeholder="Nhập số km"
          required
        />
      </div>

      <div>
        <Label htmlFor="battery">Pin còn lại (%)</Label>
        <Input
          id="battery"
          value={battery}
          onChange={(e) => setBattery(e.target.value)}
          placeholder="Nhập % pin"
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nhập ghi chú nếu có"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Nhân viên xác nhận: {staffDisplay}
        </p>
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thông tin"}
        </Button>
      </div>
    </form>
  );
}
