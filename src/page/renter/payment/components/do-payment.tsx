import { useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { vnd } from "@/lib/utils/currency";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingRequest } from "@/@types/order/order-booking";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { Model } from "@/@types/car/model";
import { useAvailableCarEVs } from "@/hooks/use-available-car";
import bank from "@/images/bank.png";
type PaymentState = {
  amount: number;
  model: Model;
  depotId: string;
  paymentMethod: "BANKING" | "CASH";
  notes?: string;
  searchForm: {
    start: string;
    end: string;
  };
};

function toISO(d: string) {
  try {
    return new Date(d).toISOString();
  } catch {
    return d;
  }
}

function stripDownloadParam(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.delete("download");
    return u.toString();
  } catch {
    return url.replace(/(&|\?)download=true&?/, "$1").replace(/[?&]$/, "");
  }
}

export default function DoPayment() {
  const { state } = useLocation() as { state?: PaymentState };
  const { user, isAuthenticated } = useAuthStore();

  const [isPosting, setIsPosting] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { data, isLoading } = useAvailableCarEVs({
    modelId: state?.model?.id,
    depotId: state?.depotId,
  });

  const amount = state?.amount ?? 0;

  async function handleCreateOrder() {
    if (!state) return toast.error("Thiếu dữ liệu thanh toán.");
    if (!isAuthenticated)
      return toast.error("Bạn cần đăng nhập trước khi thanh toán.");
    if (isLoading) return toast.message("Đang tải xe khả dụng...");

    const rawCandidates = data?.available ?? [];
    const candidates = rawCandidates.filter(
      (c) => (c?.modelId ?? c?.model?.id) === state?.model?.id
    );
    if (!candidates.length) {
      return toast.error("Không còn xe khả dụng tại trạm này.");
    }

    const chosen = candidates[0];
    setIsPosting(true);
    try {
      const body: OrderBookingRequest = {
        carEVDetailId: chosen.id as string,
        depotId: state.depotId,
        startAt: toISO(state.searchForm.start),
        endAt: toISO(state.searchForm.end),
        paymentMethod: state.paymentMethod,
        paymentType: "DEPOSIT",
        note: state.notes ?? "",
        isOfflineBooking: false,
        customerName: user?.name ?? "",
        customerPhone: user?.phone ?? "",
        customerEmail: user?.email ?? "",
        customerAddress: "",
      };

      const res = await orderBookingAPI.create(body);
      const { qrUrl, orderBooking } = res.data.data;

      setOrderId(orderBooking.id);
      setQrUrl(stripDownloadParam(qrUrl));
      toast.success("Tạo đơn thành công. Vui lòng quét mã để đặt cọc.");
    } catch (e) {
      console.error("[OrderBooking][POST][error]", e);
      toast.error("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <div className="rounded-2xl border bg-white shadow-sm">
        <header className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Thanh toán</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div className="rounded-xl border p-4 space-y-3">
              <h2 className="font-semibold text-lg">Thông tin đơn hàng</h2>
              <hr className="border-t" />
              <div className="space-y-3 text-md">
                <div>
                  <div className="text-gray-600">Số tiền thanh toán</div>
                  <div className="text-blue-600">{vnd(amount)} VND</div>
                </div>
                <div>
                  <div className="text-gray-600">Phương thức</div>
                  <div className="text-gray-900">
                    {state?.paymentMethod === "BANKING"
                      ? "Chuyển khoản (QR)"
                      : "Tiền mặt"}
                  </div>
                </div>
                {orderId && (
                  <div>
                    <div className="text-gray-600">Mã đơn hệ thống</div>
                    <div className="font-mono">{orderId}</div>
                  </div>
                )}
              </div>

              <button
                className="mt-2 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                onClick={handleCreateOrder}
                disabled={isPosting || isLoading}
              >
                {isPosting ? "Đang tạo đơn..." : "Tạo mã QR & đặt cọc"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border p-4 flex flex-col items-center">
            <h3 className="font-semibold mb-4 text-center">
              Quét mã qua ứng dụng Ngân hàng / Ví điện tử
            </h3>

            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR thanh toán"
                className="w-72 h-72 object-contain bg-white p-2 rounded"
              />
            ) : (
              <div className="w-72 h-72 flex items-center justify-center text-sm text-gray-500">
                {isLoading
                  ? "Đang tải xe khả dụng..."
                  : 'Bấm "Tạo mã QR & đặt cọc" để hiển thị mã.'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-4"></div>
      <div className="w-full mt-6">
        <div className="max-w-6xl mx-auto px-6">
          <img
            src={bank}
            alt="Ngân hàng/ ví điện tử hỗ trợ"
            loading="lazy"
            className="w-full h-28 sm:h-36 md:h-48 lg:h-56 xl:h-64 2xl:h-72 object-contain select-none pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}
