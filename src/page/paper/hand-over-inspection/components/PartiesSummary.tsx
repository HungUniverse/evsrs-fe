import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { getEmail, getPhone } from "@/hooks/get-user-contact";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
} from "@/lib/constants/hire-info";

export default function PartiesSummary({
  order,
}: {
  order: OrderBookingDetail;
}) {
  return (
    <section className="rounded-lg border p-4 space-y-4">
      <div className="font-semibold">1. Thông tin các bên</div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="font-medium">Bên cho thuê:</div>
          <p>Tên công ty: {COMPANY_NAME}</p>
          <p>Địa điểm: {order?.depot.name}</p>
          <p>SDT: {COMPANY_PHONE}</p>
          <p>Email: {COMPANY_EMAIL}</p>
        </div>

        <div className="space-y-1">
          <div className="font-medium">Bên thuê:</div>
          <p>Họ và tên: {order.user?.userName || "—"}</p>
          <p>Email: {getEmail(order?.user) || "—"}</p>
          <p>Phone: {getPhone(order?.user) || "—"}</p>
        </div>
      </div>
    </section>
  );
}
