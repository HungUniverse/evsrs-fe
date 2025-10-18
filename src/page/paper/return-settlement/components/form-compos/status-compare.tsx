import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  odoReceive: number;
  batReceive: number;
  odoReturn: string;
  batReturn: string;
  setOdoReturn: (v: string) => void;
  setBatReturn: (v: string) => void;
  odoDiff: number;
  batDiff: number;
  permittedKm: number;
  days: number;
  dailyLimit: number;
};

export default function StatusCompare({
  odoReceive,
  batReceive,
  odoReturn,
  batReturn,
  setOdoReturn,
  setBatReturn,
  odoDiff,
  batDiff,
  permittedKm,
  days,
  dailyLimit,
}: Props) {
  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="font-semibold">So sánh hiện trạng</div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Odometer lúc nhận</Label>
          <Input className="font-medium" value={odoReceive || ""} disabled />
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
          <Input value={batReceive || ""} disabled />
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
        Chênh lệch Odo: <b>{Number.isFinite(odoDiff) ? odoDiff : "—"}</b> km,
        Hao pin: <b>{Number.isFinite(batDiff) ? batDiff : "—"}</b> %
      </div>
      <div className="text-xs text-slate-500">
        Giới hạn: {permittedKm.toLocaleString("vi-VN")} km ({dailyLimit} km/ngày
        × {days} ngày)
      </div>
    </div>
  );
}
