import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import DetailInformation from "../../../renter/profile/account-trips/details/components/detail-information";
import StaffDetailPaper from "./detail-paper";
import DetailPrice from "../../../renter/profile/account-trips/details/components/detail-price";
import FeedbackDisplay from "./feedback-display";
import { TRIP_STATUS_LABEL } from "@/lib/constants/trip-status";
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

export default function StaffTripDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [booking, setBooking] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!orderId) return;
    console.log("[StaffTripDetails] Loading order:", orderId);
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await orderBookingAPI.getById(orderId);
        console.log("[StaffTripDetails] API response:", res);
        setBooking(res.data.data);
      } catch {
        setError("Không tải được chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const canCancelBooking = useMemo(() => {
    if (!booking) return false;

    // Block cancel button if status is COMPLETED, CANCELLED, or REFUND_PENDING
    const blockedStatuses = ["COMPLETED", "CANCELLED", "REFUND_PENDING"];

    if (blockedStatuses.includes(booking.status)) {
      return false;
    }

    return true;
  }, [booking]);

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderId) return;

    setCancelling(true);
    try {
      await orderBookingAPI.cancel(orderId, cancelReason || "Không có lý do");
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
          <StaffDetailPaper orderId={booking.id} />
        </div>
      </section>

      <DetailPrice booking={booking} />

      {/* Feedback Display */}
      <FeedbackDisplay
        orderBookingId={booking.id}
        orderStatus={booking.status}
      />

      {/* Cancel Booking Button */}
      {canCancelBooking && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleCancelClick}
            className="hover:bg-red-600 transition-colors"
          >
            Hủy chuyến
          </Button>
        </div>
      )}

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
            <div className="space-y-2">
              <Label htmlFor="cancel-reason" className="text-sm font-medium">
                Lý do hủy chuyến
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
