import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  generateSepaySettlementQR,
  checkSepaySettlementStatus,
} from "@/apis/sepay.api";
import { toast } from "sonner";
import { CreditCard, Loader2, QrCode, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SepaySettlementStatus } from "@/@types/payment/sepay";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

interface SettlementPaymentQRProps {
  settlementId: string;
  orderBookingId?: string;
}

export default function SettlementPaymentQR({
  settlementId,
  orderBookingId,
}: SettlementPaymentQRProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [paymentInfo, setPaymentInfo] = useState<{
    total: string;
    orderCode: string;
  } | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll payment status when dialog is open
  useEffect(() => {
    if (!open || !settlementId) return;

    const checkPaymentStatus = async () => {
      try {
        console.log("[SettlementPayment] Checking status for:", settlementId);
        const response = await checkSepaySettlementStatus(settlementId);
        console.log("[SettlementPayment] Status response:", response);

        if (response.data.paymentStatus === SepaySettlementStatus.PAID) {
          toast.success("Thanh toán thành công! Đang chuyển hướng...");
          setOpen(false);

          // Clear polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          setTimeout(() => {
            // Refresh page or navigate to trip detail
            if (orderBookingId) {
              if (user?.role === "STAFF") {
                navigate(`/staff/trip/${orderBookingId}`);
              } else {
                navigate(`/account/my-trip/${orderBookingId}`);
              }
            } else {
              window.location.reload();
            }
          }, 1500);
        }
      } catch (error) {
        console.error("[SettlementPayment] Check status error:", error);
      }
    };

    // Check immediately
    checkPaymentStatus();

    // Then check every 5 seconds
    pollingIntervalRef.current = setInterval(checkPaymentStatus, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [open, settlementId, orderBookingId, navigate]);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      console.log("[SettlementPayment] Generating QR for:", settlementId);
      const response = await generateSepaySettlementQR(settlementId);
      console.log("[SettlementPayment] QR response:", response);

      // Response.data is the QR URL string
      if (response.data) {
        setQrUrl(response.data);
        setOpen(true);

        // Fetch payment info to display
        try {
          const statusResponse = await checkSepaySettlementStatus(settlementId);
          if (statusResponse.data) {
            setPaymentInfo({
              total: statusResponse.data.total,
              orderCode: statusResponse.data.orderCode,
            });
          }
        } catch (err) {
          console.error("[SettlementPayment] Fetch info error:", err);
        }
      } else {
        toast.error("Không thể tạo mã QR");
      }
    } catch (error) {
      console.error("[SettlementPayment] Generate QR error:", error);
      toast.error("Lỗi khi tạo mã QR thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-gradient-to-br from-emerald-50 to-green-50 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-emerald-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Thanh toán chi phí phát sinh
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Quét mã QR để thanh toán các chi phí phát sinh trong hợp đồng
            </p>
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-5 w-5" />
                Thanh toán ngay
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Quét mã QR để thanh toán
            </DialogTitle>
            <DialogDescription className="text-center">
              Vui lòng sử dụng ứng dụng ngân hàng để quét mã QR bên dưới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Payment Info */}
            {paymentInfo && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 space-y-2 border border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {paymentInfo.orderCode}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-emerald-200 pt-2">
                  <span className="text-sm text-gray-600">
                    Tổng thanh toán:
                  </span>
                  <span className="font-bold text-xl text-emerald-600">
                    {Number(paymentInfo.total).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            )}

            {/* QR Code Display */}
            {qrUrl && (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-emerald-500">
                    <img
                      src={qrUrl}
                      alt="Payment QR Code"
                      className="w-64 h-64 object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-emerald-500 rounded-full p-2 shadow-lg">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Hướng dẫn thanh toán:
              </h4>
              <ol className="space-y-2 text-sm text-gray-700 ml-7 list-decimal">
                <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                <li>Chọn chức năng quét mã QR</li>
                <li>Quét mã QR hiển thị trên màn hình</li>
                <li>Xác nhận thông tin và hoàn tất thanh toán</li>
              </ol>
            </div>

            {/* Payment Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 font-medium text-center">
                ⏱️ Vui lòng hoàn tất thanh toán trong vòng 15 phút
              </p>
            </div>

            {/* Status Check Info */}
            <div className="text-center text-xs text-gray-500">
              Sau khi thanh toán thành công, hệ thống sẽ tự động cập nhật trạng
              thái
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Đóng
            </Button>
            <Button
              onClick={handleGenerateQR}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Tạo lại mã QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
