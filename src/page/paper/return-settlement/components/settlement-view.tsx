import type { ReturnSettlement } from "@/@types/order/return-settlement";
import { toNum } from "@/hooks/use-booking-car-cal";

function Row({ l, r }: { l: string; r?: string | number | null }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-slate-600">{l}</span>
      <span className="font-medium">{r ?? "—"}</span>
    </div>
  );
}

export default function SettlementView({ data }: { data: ReturnSettlement }) {
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">Biên bản thanh toán khi trả xe</div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-md border p-3">
          <div className="font-medium mb-2">Tổng kết</div>
          <Row
            l="Tính lúc"
            r={new Date(data.calculateAt).toLocaleString("vi-VN")}
          />
          <Row l="Subtotal" r={toNum(data.subtotal).toLocaleString("vi-VN")} />
          <Row l="Giảm tổng" r={toNum(data.discount).toLocaleString("vi-VN")} />
          <Row
            l="Tổng thanh toán"
            r={toNum(data.total).toLocaleString("vi-VN")}
          />
          <Row l="Ghi chú" r={data.notes} />
        </div>

        <div className="rounded-md border p-3">
          <div className="font-medium mb-2">Các khoản phát sinh</div>
          {data.settlementItems?.length ? (
            <div className="divide-y">
              {data.settlementItems.map((it) => (
                <div key={it.id} className="py-2">
                  <div className="font-medium">{it.description || "—"}</div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      Phí: {toNum(it.feeIncurred).toLocaleString("vi-VN")}
                    </div>
                    <div>
                      Giảm: {toNum(it.discount).toLocaleString("vi-VN")}
                    </div>
                    <div>
                      Tổng:{" "}
                      <span className="font-semibold">
                        {toNum(it.total).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  {it.notes && (
                    <div className="text-xs text-slate-500 mt-1">
                      Ghi chú: {it.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              Không có khoản phát sinh
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
