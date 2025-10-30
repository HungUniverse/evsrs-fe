import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus } from "@/@types/enum";
import {
  TRIP_STATUS_LABEL,
  TRIP_STATUS_PILL,
} from "@/lib/constants/trip-status";

type Props = {
  data: OrderBookingDetail[];
  onClickCode?: (orderId: string) => void;
  onClickUser?: (userId: string) => void;
};
const COLS = "grid-cols-[1.1fr_1fr_1fr_1fr_1fr_1.4fr_0.9fr]";
export default function ShowTrip({ data, onClickCode, onClickUser }: Props) {
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

      <div className="divide-y">
        {data.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500">
            Không có chuyến nào phù hợp.
          </div>
        )}

        {data.map((booking) => {
          const modelName = booking.carEvs?.model?.modelName || "—";
          const userName = booking.user?.fullName || "—";
          const depotName = booking.depot?.name || "—";
          const depotAddress = booking.depot
            ? `${booking.depot.street}, ${booking.depot.ward}, ${booking.depot.district}, ${booking.depot.province}`
            : "—";

          return (
            <div
              key={booking.id}
              className={`grid ${COLS} text-sm items-center`}
            >
              <div className="px-4 py-3">
                <button
                  className="text-sky-600 hover:underline"
                  onClick={() => onClickCode?.(booking.id)}
                  title="Xem chi tiết"
                >
                  {booking.code}
                </button>
              </div>

              {/* 2. Dòng xe */}
              <div className="px-4 py-3 text-slate-700">{modelName}</div>

              {/* 3. Người thuê */}
              <div className="px-4 py-3">
                {booking.user?.userId || booking.user?.id ? (
                  <button
                    className="text-sky-600 hover:underline truncate block w-full text-left"
                    onClick={() =>
                      onClickUser?.(booking.user.userId || booking.user.id!)
                    }
                    title="Xem thông tin người thuê"
                  >
                    {userName}
                  </button>
                ) : (
                  <span className="text-slate-700 truncate">{userName}</span>
                )}
              </div>

              {/* 4. Thời gian nhận xe */}
              <div className="px-4 py-3 text-slate-700">
                {fmtDateTime(booking.startAt)}
              </div>

              {/* 5. Thời gian trả xe */}
              <div className="px-4 py-3 text-slate-700">
                {fmtDateTime(booking.endAt)}
              </div>

              {/* 6. Địa chỉ nhận xe */}
              <div
                className="px-4 py-3 text-slate-700 truncate"
                title={depotAddress}
              >
                {depotName}
              </div>

              {/* 7. Trạng thái */}
              <div className="px-4 py-3">
                <StatusPill status={booking.status} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: OrderBookingStatus }) {
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
