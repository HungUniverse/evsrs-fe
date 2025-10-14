import type { ReturnSettlement } from "@/@types/order/return-settlement";

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
          <Row l="Subtotal" r={data.subtotal} />
          <Row l="Giảm tổng" r={data.discount} />
          <Row l="Tổng thanh toán" r={data.total} />
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
                    <div>Phí: {it.feeIncurred}</div>
                    <div>Giảm: {it.discount}</div>
                    <div>
                      Tổng: <span className="font-semibold">{it.total}</span>
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
