import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { contractAPI } from "@/apis/contract.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { TRIP_STATUS_LABEL } from "@/lib/constants/trip-status";
import DetailInformation from "./components/detail-information";
import DetailPaper from "./components/detail-paper";
import DetailPrice from "./components/detail-price";
import AfterPaymentQR from "./components/AfterPaymentQR";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TripDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [booking, setBooking] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [hasContract, setHasContract] = useState(false);
  const [checkingContract, setCheckingContract] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await orderBookingAPI.getById(orderId);
        setBooking(res.data.data);

        // Check if contract exists
        setCheckingContract(true);
        try {
          const contract = await contractAPI.getByOrderId(orderId);
          setHasContract(!!contract);
        } catch {
          // If contract doesn't exist or error, allow cancel
          setHasContract(false);
        } finally {
          setCheckingContract(false);
        }
      } catch {
        setError("Không tải được chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const canCancelBooking = useMemo(() => {
    if (!booking) return false;

    // Only allow cancel if status is PENDING or CONFIRMED
    const isPendingOrConfirmed =
      booking.status === "PENDING" || booking.status === "CONFIRMED";

    if (!isPendingOrConfirmed) return false;

    // Cannot cancel if contract exists
    if (hasContract) return false;

    return true;
  }, [booking, hasContract]);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderId) return;

    setCancelling(true);
    try {
      await orderBookingAPI.cancel(orderId, cancelReason);
      toast.success("Đã hủy chuyến thuê thành công");
      const res = await orderBookingAPI.getById(orderId);
      setBooking(res.data.data);
      setShowCancelDialog(false);
      setCancelReason("");
    } catch {
      toast.error("Không thể hủy chuyến. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-600">Đang tải dữ liệu…</div>;
  }
  if (error || !booking) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-slate-600">Order ID: {orderId}</p>
        {error && <p className="text-red-500 mt-2">Lỗi: {error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5 md:p-6">
        <div className="text-lg font-semibold mb-4">Chi tiết đơn hàng</div>

        <div className="rounded-xl bg-sky-100 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-sm">Mã đơn hàng:&nbsp;</span>
            <span className="font-medium tracking-wide">{booking.code}</span>
          </div>
          <span className="text-sm font-medium text-slate-600">
            {TRIP_STATUS_LABEL[booking.status]}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          <DetailInformation booking={booking} />
          <DetailPaper orderId={booking.id} />
        </div>
      </section>

      {/* Payment QR for pending orders */}

      <DetailPrice booking={booking} />
      {booking.status === "PENDING" && <AfterPaymentQR orderId={booking.id} />}

      {/* Cancel Booking Button */}
      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={handleCancelClick}
          disabled={!canCancelBooking || checkingContract}
          className="hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            checkingContract
              ? "Đang kiểm tra..."
              : !canCancelBooking
                ? hasContract
                  ? "Không thể hủy chuyến (đã có hợp đồng)"
                  : "Không thể hủy chuyến (trạng thái không phù hợp)"
                : "Hủy chuyến"
          }
        >
          {checkingContract ? "Đang kiểm tra..." : "Hủy chuyến"}
        </Button>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Xác nhận hủy chuyến
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              Bạn có chắc chắn muốn hủy chuyến thuê này không?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-700">
              Vui lòng đọc chính sách hủy chuyến của chúng tôi{" "}
              <Link
                to="/policies"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
                target="_blank"
              >
                ở đây
              </Link>
              .
            </p>

            <div className="space-y-2">
              <Label htmlFor="cancel-reason" className="text-sm font-medium">
                Lý do hủy chuyến <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Vui lòng nhập lý do hủy chuyến..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={cancelling}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Không, giữ chuyến
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? "Đang hủy..." : "Có, hủy chuyến"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
