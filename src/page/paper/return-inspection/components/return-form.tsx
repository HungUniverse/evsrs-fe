import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UploadReturn from "./upload-return";

export default function ReturnForm({
  staffDisplay,
  defaultBattery = "60",
  onSubmit,
  loading,
}: {
  staffDisplay: string;
  defaultBattery?: string;
  loading?: boolean;
  onSubmit: (v: {
    odometer: string;
    batteryPercent: string;
    notes: string;
    image?: string;
  }) => void;
}) {
  const [odo, setOdo] = useState("0");
  const [battery, setBattery] = useState(defaultBattery);
  const [notes, setNotes] = useState("");
  const [imageUrls, setImageUrls] = useState<string>("");

  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">Ghi nhận khi trả xe</div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="odo">Odometer (km)</Label>
          <Input
            id="odo"
            value={odo}
            onChange={(e) => setOdo(e.target.value)}
            inputMode="numeric"
            placeholder="Ví dụ: 13567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bat">Battery (%)</Label>
          <Input
            id="bat"
            value={battery}
            onChange={(e) => setBattery(e.target.value)}
            inputMode="numeric"
            placeholder="0 - 100"
          />
        </div>
        <div className="space-y-2">
          <Label>Nhân viên thực hiện</Label>
          <Input value={staffDisplay} disabled />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú</Label>
        <Textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Vết xước mới, phụ kiện thiếu, mùi lạ..."
        />
      </div>
      <UploadReturn
        label="Ảnh hiện trạng lúc trả xe"
        value={imageUrls}
        onChange={setImageUrls}
      />

      <div className="flex justify-end">
        <Button
          onClick={() =>
            onSubmit({
              odometer: odo,
              batteryPercent: battery,
              notes,
              image: imageUrls,
            })
          }
          disabled={loading}
        >
          {loading ? "Đang lưu..." : " Lập biên bản trả"}
        </Button>
      </div>
    </section>
  );
}
