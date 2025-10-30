import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { vnd } from "@/lib/utils/currency";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { checkSepayOrderStatus } from "@/apis/sepay.api";
import { SepayOrderStatus } from "@/@types/payment/sepay";
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
  const navigate = useNavigate();

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedCreateRef = useRef(false); // Prevent double creation

  const { data, isLoading } = useAvailableCarEVs({
    modelId: state?.model?.id,
    depotId: state?.depotId,
  });

  const amount = state?.amount ?? 0;

  // Debug logs
  useEffect(() => {
    console.log("[DoPayment] Available cars data:", data);
    console.log("[DoPayment] Is loading:", isLoading);
    console.log("[DoPayment] State:", state);
  }, [data, isLoading, state]);

  // Load saved QR and orderId from localStorage on mount
  useEffect(() => {
    const savedQr = localStorage.getItem("payment_qr_url");
    const savedOrderId = localStorage.getItem("payment_order_id");

    console.log("[DoPayment] Load from localStorage:", {
      savedQr,
      savedOrderId,
    });

    if (savedQr) setQrUrl(savedQr);
    if (savedOrderId) setOrderId(savedOrderId);
  }, []);

  // Create order automatically when component mounts and data is ready
  useEffect(() => {
    console.log("[DoPayment] Create order check:", {
      hasState: !!state,
      hasOrderId: !!orderId,
      isCreating: isCreatingOrder,
      isLoadingCars: isLoading,
      hasData: !!data,
      hasAttempted: hasAttemptedCreateRef.current,
    });

    if (!state) {
      console.log("[DoPayment] No state, skipping order creation");
      return;
    }
    if (orderId) {
      console.log("[DoPayment] Order already created:", orderId);
      return;
    }
    if (isCreatingOrder) {
      console.log("[DoPayment] Already creating order");
      return;
    }
    if (hasAttemptedCreateRef.current) {
      console.log("[DoPayment] Already attempted to create order");
      return;
    }
    if (isLoading) {
      console.log("[DoPayment] Still loading available cars, waiting...");
      return;
    }
    if (!data) {
      console.log("[DoPayment] No data yet, waiting...");
      return;
    }

    console.log("[DoPayment] All conditions met, creating order...");
    hasAttemptedCreateRef.current = true; // Mark as attempted
    createOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, orderId, isCreatingOrder, isLoading, data]);

  // Poll Sepay status every 5 seconds when orderId exists
  useEffect(() => {
    if (!orderId || state?.paymentMethod !== "BANKING") {
      console.log("[DoPayment][Polling] Not starting poll:", {
        orderId,
        paymentMethod: state?.paymentMethod,
      });
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await checkSepayOrderStatus(orderId);

        if (response.message === SepayOrderStatus.PAID_DEPOSIT) {
          // Payment successful

          // Clear localStorage
          localStorage.removeItem("payment_qr_url");
          localStorage.removeItem("payment_order_id");

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          setTimeout(() => {
            navigate("/account/my-trip");
          }, 5500);
        }
      } catch (error) {
        console.error("[Sepay][Poll][Error]", error);
      }
    };

    pollingIntervalRef.current = setInterval(pollStatus, 5000);

    pollStatus();

    return () => {
      if (pollingIntervalRef.current) {
        console.log("[DoPayment][Polling] Cleanup interval");
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [orderId, state?.paymentMethod, navigate]);

  async function createOrder() {
    console.log("[DoPayment][createOrder] Starting...");

    if (!state) {
      console.log("[DoPayment][createOrder] No state");
      toast.error("Thiếu dữ liệu thanh toán.");
      return;
    }
    if (!isAuthenticated) {
      return;
    }
    if (isLoading) {
      console.log("[DoPayment][createOrder] Still loading cars");
      toast.message("Đang tải xe khả dụng...");
      return;
    }

    const rawCandidates = data?.available ?? [];
    console.log("[DoPayment][createOrder] Raw candidates:", rawCandidates);

    const candidates = rawCandidates.filter(
      (c) => (c?.modelId ?? c?.model?.id) === state?.model?.id
    );

    console.log("[DoPayment][createOrder] Filtered candidates:", candidates);
    console.log(
      "[DoPayment][createOrder] Looking for modelId:",
      state?.model?.id
    );

    if (!candidates.length) {
      console.log("[DoPayment][createOrder] No candidates found!");
      toast.error("Không còn xe khả dụng tại trạm này.");
      return;
    }

    const chosen = candidates[0];
    console.log("[DoPayment][createOrder] Chosen car:", chosen);

    setIsCreatingOrder(true);

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
      const cleanQrUrl = stripDownloadParam(qrUrl);

      setOrderId(orderBooking.id);
      setQrUrl(cleanQrUrl);

      localStorage.setItem("payment_qr_url", cleanQrUrl);
      localStorage.setItem("payment_order_id", orderBooking.id);

      toast.success("Tạo đơn thành công. Vui lòng quét mã để thanh toán.");
    } catch (e) {
      console.error("[OrderBooking][POST][error]", e);
      toast.error("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
      // Reset flag on error so user can retry
      hasAttemptedCreateRef.current = false;
    } finally {
      setIsCreatingOrder(false);
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
              </div>

              {isCreatingOrder && (
                <div className="mt-2 text-sm text-blue-600">
                  Đang tạo đơn hàng và mã QR...
                </div>
              )}
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
                {isCreatingOrder
                  ? "Đang tạo mã QR..."
                  : isLoading
                    ? "Đang tải xe khả dụng..."
                    : "Đang khởi tạo mã QR..."}
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
