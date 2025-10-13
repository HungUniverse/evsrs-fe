import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";

function toNum(x: unknown) {
  if (typeof x === "number") return x;
  if (typeof x === "string") return Number(x.replace(/,/g, ""));
  return 0;
}

export default function ContractCosts({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        if (!ignore) setOrder(res.data.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [orderId]);

  const carName = order?.carEvs?.model?.modelName || "Mẫu xe";
  const startDate = order?.startAt ? new Date(order.startAt) : null;
  const endDate = order?.endAt ? new Date(order.endAt) : null;

  const subTotal = toNum(order?.subTotal);
  const deposit = toNum(order?.depositAmount);
  const remaining =
    toNum(order?.remainingAmount) || Math.max(0, subTotal - deposit);

  const timeRange = useMemo(() => {
    if (!startDate || !endDate) return "—";
    return `${startDate.toLocaleString("vi-VN")} → ${endDate.toLocaleString("vi-VN")}`;
  }, [startDate, endDate]);

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-5 md:p-6">
        <div className="h-5 w-40 bg-slate-100 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-72 bg-slate-100 rounded" />
          <div className="h-4 w-60 bg-slate-100 rounded" />
          <div className="h-4 w-40 bg-slate-100 rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className=" text-lg p-5 md:p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        2. Chi phí thanh toán
      </h3>

      <div className="space-y-2 text-md  text-slate-700">
        <div className="flex justify-left gap-3">
          <span className="font-medium">Xe: </span>
          <span className="">{carName}</span>
        </div>
        <div className="flex justify-left gap-3">
          <span className="font-medium">Thời hạn: </span>
          <span className="">{timeRange}</span>
        </div>
        <div className="flex justify-left gap-3">
          <span className="font-medium">Tổng tiền: </span>
          <span className=" ">{subTotal.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex justify-left gap-3">
          <span className="font-medium"> Đã cọc: </span>
          <span className="">{deposit.toLocaleString("vi-VN")}đ</span>
        </div>
        <div className="flex justify-left gap-5">
          <span className="font-medium">Còn lại: </span>
          <span>{remaining.toLocaleString("vi-VN")}đ</span>
        </div>

        {/* Phần dịch vụ/bảo hiểm & one-way giữ nguyên text như file bạn đang dùng */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            3. Chi phí dịch vụ và bảo hiểm (Service and insurance costs)
          </h3>
          <div className="space-y-1 pl-4">
            <div>
              <span className="font-medium text-gray-600">Bảo hiểm:</span>
              <span className="ml-2 text-gray-800">50.000 VNĐ/người</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Vệ sinh xe:</span>
              <span className="ml-2 text-gray-800">
                200.000VNĐ nếu xe bẩn quá mức thông thường.
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Sự cố đặc biệt:</span>
              <span className="ml-2 text-gray-800">
                mất giấy tờ/chìa khóa bồi thường 1.000.000 - 3.000.000 VNĐ; hết
                pin 500.000 - 1.000.000 VNĐ/lần; hư hỏng do lỗi KH theo báo giá
                hãng/đơn vị cho thuê.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            4. Chi phí trả xe tại chi nhánh khác (One-way fee)
          </h3>
          <div className="space-y-1 pl-4">
            <div>Trả khác chi nhánh nhận ban đầu sẽ phát sinh phí.</div>
            <div>
              Mức cố định: 200.000 - 500.000 VNĐ/lần, hoặc theo km: 10.000 -
              15.000 VNĐ/km.
            </div>
            <div>
              Một số chương trình khuyến mãi hoặc car-sharing nội thành có thể
              được miễn phí.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
