type Props = {
  staffDisplay: string;
  baseSubtotal: number;
  itemsTotal: number;
  overKmFee: number;
  exceededKm: number;
  ratePerKm?: number;
  subtotal: number;
};

export default function FeesSummary(p: Props) {
  const {
    staffDisplay,
    baseSubtotal,
    itemsTotal,
    overKmFee,
    exceededKm,
    ratePerKm,
    subtotal,
  } = p;

  return (
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
        Phát sinh khác: <b>{itemsTotal.toLocaleString("vi-VN")}</b>
      </div>

      <div className="text-sm">
        <span className="font-medium">Subtotal mới:</span>{" "}
        <b>{subtotal.toLocaleString("vi-VN")}</b>
      </div>
    </div>
  );
}
