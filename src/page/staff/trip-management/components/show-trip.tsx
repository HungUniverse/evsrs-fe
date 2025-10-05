import type { Contract } from "@/@types/contract";
import {
  TRIP_STATUS_LABEL,
  TRIP_STATUS_PILL,
  type TripStatus,
} from "@/lib/constants/trip-status";

type Props = {
  data: Contract[];
  onClickCode?: (orderId: string) => void;
};
const COLS = "grid-cols-[1.1fr_1fr_1fr_1fr_1fr_1.4fr_0.9fr]";
export default function ShowTrip({ data, onClickCode }: Props) {
  return (
    <section className="rounded-xl overflow-hidden border">
      <div
        className={`grid ${COLS} bg-emerald-100 text-emerald-900 text-sm font-medium`}
      >
        {[
          "Đơn hàng",
          "Dòng xe",
          "Người thuê",
          "Thời gian nhận xe",
          "Thời gian trả xe",
          "Địa chỉ nhận xe",
          "Trạng thái",
        ].map((h) => (
          <div key={h} className="px-4 py-3">
            {h}
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="divide-y">
        {data.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500">
            Không có chuyến nào phù hợp.
          </div>
        )}

        {data.map((c) => (
          <div key={c.orderId} className={`grid ${COLS} text-sm items-center`}>
            {/* 1. Đơn hàng */}
            <div className="px-4 py-3">
              <button
                className="text-sky-600 hover:underline"
                onClick={() => onClickCode?.(c.orderId)}
                title="Xem chi tiết"
              >
                {c.orderId}
              </button>
            </div>

            {/* 2. Dòng xe */}
            <div className="px-4 py-3 text-slate-700">
              {c.vehicleCode || c.title}
            </div>

            {/* 3. Người thuê  ✅ THÊM CỘT NÀY */}
            <div
              className="px-4 py-3 text-slate-700 truncate"
              title={c.lesseeFullName}
            >
              {c.lesseeFullName || "—"}
            </div>

            {/* 4. Thời gian nhận xe */}
            <div className="px-4 py-3 text-slate-700">
              {fmtDateTime(c.rentalStartDate)}
            </div>

            {/* 5. Thời gian trả xe */}
            <div className="px-4 py-3 text-slate-700">
              {fmtDateTime(c.rentalEndDate)}
            </div>

            {/* 6. Địa chỉ nhận xe */}
            <div
              className="px-4 py-3 text-slate-700 truncate"
              title={c.pickupAddress}
            >
              {c.pickupAddress}
            </div>

            {/* 7. Trạng thái */}
            <div className="px-4 py-3">
              <StatusPill status={c.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: TripStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium ${TRIP_STATUS_PILL[status]}`}
    >
      {TRIP_STATUS_LABEL[status]}
    </span>
  );
}

function fmtDateTime(s: string) {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(
    d.getMonth() + 1
  )}/${d.getFullYear()}`;
}
