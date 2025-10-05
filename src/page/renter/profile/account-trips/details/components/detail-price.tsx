import type { Contract } from "@/@types/contract";

type ExtraFee = { label: string; unitPrice: number; qty?: number };

export default function DetailPrice({
  contract,
  extras = [],
}: {
  contract: Contract;
  extras?: ExtraFee[];
}) {
  const vnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";

  const rows = [
    {
      label: "Cước phí niêm yết",
      unitPrice: contract.dailyRate,
      qty: Math.max(1, contract.rentalDurationDays),
    },
    ...extras.map((e) => ({
      label: e.label,
      unitPrice: e.unitPrice,
      qty: e.qty ?? 1,
    })),
  ];

  const subTotal = rows.reduce((s, r) => s + r.unitPrice * r.qty, 0);
  const grandTotal = subTotal + (contract.depositAmount || 0);

  return (
    <section className="mt-2">
      <div className="text-emerald-700 font-semibold text-xs tracking-wide">
        BẢNG KÊ CHI TIẾT
      </div>

      <div className="mt-2 rounded-xl overflow-hidden border">
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] bg-emerald-100 text-emerald-900 text-sm font-medium">
          <div className="px-4 py-3">Loại</div>
          <div className="px-4 py-3">Đơn giá</div>
          <div className="px-4 py-3">Số lượng</div>
          <div className="px-4 py-3">Tổng</div>
        </div>

        <div className="divide-y">
          {rows.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] text-sm"
            >
              <div className="px-4 py-3 text-slate-700">{r.label}</div>
              <div className="px-4 py-3">{vnd(r.unitPrice)}</div>
              <div className="px-4 py-3">{r.qty}</div>
              <div className="px-4 py-3">{vnd(r.unitPrice * r.qty)}</div>
            </div>
          ))}

          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] text-sm">
            <div className="px-4 py-3 text-slate-700 font-medium">
              Tiền đặt cọc
            </div>
            <div className="px-4 py-3 col-span-2" />
            <div className="px-4 py-3">{vnd(contract.depositAmount)}</div>
          </div>

          <div className="px-4">
            <div className="border-t" />
          </div>

          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] text-sm font-semibold">
            <div className="px-4 py-4">Tổng</div>
            <div className="px-4 py-4 col-span-2" />
            <div className="px-4 py-4 text-slate-900">{vnd(grandTotal)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
