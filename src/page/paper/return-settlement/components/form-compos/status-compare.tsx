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
function formatDayAndShift(day: number): string {
  // Làm tròn 2 chữ số thập phân cho an toàn
  const rounded = Number(day.toFixed(2));

  // Kiểm tra phần thập phân
  const wholeDays = Math.floor(rounded);
  const decimal = rounded - wholeDays;

  if (decimal === 0) {
    return wholeDays === 1 ? "1 ngày" : `${wholeDays} ngày`;
  }

  // Ca sáng = 0.4
  if (Math.abs(decimal - 0.4) < 0.01) {
    return wholeDays === 0 ? "Ca sáng" : `${wholeDays} ngày và ca sáng`;
  }

  // Ca chiều = 0.6
  if (Math.abs(decimal - 0.6) < 0.01) {
    return wholeDays === 0 ? "Ca chiều" : `${wholeDays} ngày và ca chiều`;
  }

  // 1 ngày đầy đủ (cả 2 ca) = 1.0
  if (Math.abs(rounded - 1.0) < 0.01) {
    return "1 ngày";
  }

  // Mặc định fallback
  return `${rounded} ngày`;
}
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
        Giới hạn: <b>{permittedKm.toLocaleString("vi-VN")}</b> km ({dailyLimit}{" "}
        km/ngày × <span className="font-medium">{formatDayAndShift(days)}</span>
        )
      </div>
    </div>
  );
}
