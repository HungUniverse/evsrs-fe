import type { Contract } from "@/@types/contract";

export default function DetailInformation({
  contract,
}: {
  contract: Contract;
}) {
  return (
    <div className="space-y-6">
      {/* Thông tin người thuê */}
      <div>
        <div className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">
          Thông tin người thuê
        </div>
        <div className="mt-3 space-y-1.5 text-sm">
          <InfoRow label="Họ và tên" value={contract.lesseeFullName} />
          <InfoRow label="Số điện thoại" value={contract.lesseePhone} />
          <InfoRow
            label="Email"
            value={contract.lesseeEmail || "—"}
            muted={!contract.lesseeEmail}
          />
        </div>
      </div>

      {/* Thông tin đơn hàng */}
      <div>
        <div className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">
          Thông tin đơn hàng
        </div>
        <div className="mt-3 space-y-1.5 text-sm">
          <InfoRow label="Hình thức thuê" value="Thuê theo ngày" />
          <InfoRow
            label="Dòng xe"
            value={contract.vehicleCode || contract.title}
          />
          <InfoRow label="Địa chỉ nhận xe" value={contract.pickupAddress} />
          <InfoRow
            label="Thời gian nhận xe"
            value={fmtDateTime(contract.rentalStartDate)}
          />
          <InfoRow
            label="Thời gian trả xe"
            value={fmtDateTime(contract.rentalEndDate)}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span className="w-40 shrink-0 text-slate-500">{label}:</span>
      <span className={muted ? "text-slate-400" : "text-slate-700"}>
        {value}
      </span>
    </div>
  );
}

function fmtDateTime(s: string) {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
