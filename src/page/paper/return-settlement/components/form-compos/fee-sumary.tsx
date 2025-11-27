type Props = {
  staffDisplay: string;
  itemsTotal: number;
  overKmFee: number;
  exceededKm: number;
  ratePerKm?: number;
  batteryFee: number;
  batDiff: number;
  returnLateFee?: number;
  subtotal: number;
};

export default function FeesSummary(p: Props) {
  const {
    staffDisplay,
    itemsTotal,
    overKmFee,
    exceededKm,
    ratePerKm,
    batteryFee,
    batDiff,
    returnLateFee = 0,
    subtotal,
  } = p;

  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="font-medium">Tổng kết</div>
      <div className="text-sm text-slate-600">
        Nhân viên: <b>{staffDisplay}</b>
      </div>

      <div className="text-sm">
        Phí vượt km: <b>{overKmFee.toLocaleString("vi-VN")}</b>
        {exceededKm > 0 && (
          <span className="text-slate-500">
            {" "}
            ({exceededKm.toLocaleString("vi-VN")} km ×{" "}
            {ratePerKm?.toLocaleString("vi-VN")})
          </span>
        )}
      </div>

      <div className="text-sm">
        Phí pin: <b>{batteryFee.toLocaleString("vi-VN")}</b>
        {batDiff > 0 && (
          <span className="text-slate-500">
            {" "}
            ({batDiff.toFixed(2)}% chênh lệch)
          </span>
        )}
      </div>
      <div className="text-sm">
        Phí trả trễ: <b>{returnLateFee.toLocaleString("vi-VN")}</b>
      </div>

      <div className="text-sm">
        Phát sinh khác: <b>{itemsTotal.toLocaleString("vi-VN")}</b>
      </div>

      <div className="text-sm border-t pt-2 mt-2">
        <span className="font-medium">Tổng thanh toán:</span>{" "}
        <b className="text-emerald-600 text-lg">
          {subtotal.toLocaleString("vi-VN")}
        </b>
      </div>
    </div>
  );
}
