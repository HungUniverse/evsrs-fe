import type { OrderBookingDetail } from "@/@types/order/order-booking";

export default function DetailPrice({
  booking,
}: {
  booking: OrderBookingDetail;
}) {
  const totalPrice = parseFloat(booking.subTotal ?? "0");
  const depositAmount = parseFloat(booking.depositAmount ?? "0");
  const remaining = parseFloat(
    booking.remainingAmount ?? `${totalPrice - depositAmount}`
  );
  const discount = parseFloat(booking.discount ?? "0");

  return (
    <section className="rounded-2xl border bg-white p-5 md:p-6">
      <h2 className="text-lg font-semibold mb-4">Chi tiết giá thuê</h2>

      <div className="space-y-3 text-sm text-slate-700">
        <PriceRow label="Tổng tiền thuê" value={totalPrice} />
        {discount > 0 && (
          <PriceRow
            label={`Giảm giá (${discount}%)`}
            value={-(totalPrice * discount) / 100}
          />
        )}
        <PriceRow label="Tiền cọc" value={-depositAmount} />
        <hr className="border-slate-200" />
        <PriceRow label="Số tiền còn lại" value={remaining} bold />
      </div>
    </section>
  );
}

function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  const formatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);

  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={bold ? "font-semibold" : ""}>{formatted}</span>
    </div>
  );
}
