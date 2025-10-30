import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateSepayRemainQR, checkSepayOrderStatus } from "@/apis/sepay.api";
import { toast } from "sonner";
import { CreditCard, Loader2, QrCode, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SepayOrderStatus } from "@/@types/payment/sepay";

interface PaymentQRProps {
  orderId: string;
}

export default function PaymentQR({ orderId }: PaymentQRProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orderId) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await checkSepayOrderStatus(orderId);

        if (response.message === SepayOrderStatus.PAID_DEPOSIT_COMPLETED) {
          toast.success("Thanh toán thành công! Đang chuyển hướng...");
          setOpen(false);

          setTimeout(() => {
            navigate("/account/my-trip");
          }, 1500);
        }
      } catch (error) {
        console.error("Check payment status error:", error);
      }
    };

    checkPaymentStatus();

    const intervalId = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(intervalId);
  }, [open, orderId, navigate]);

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const response = await generateSepayRemainQR(orderId);
      if (response.data?.qrUrl) {
        setQrUrl(response.data.qrUrl);
        setOpen(true);
        toast.success("Đã tạo mã QR thanh toán");
      } else {
        toast.error("Không thể tạo mã QR");
      }
    } catch (error) {
      console.error("Generate QR error:", error);
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
                Thanh toán hợp đồng
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Quét mã QR để hoàn tất thanh toán cho hợp đồng này
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
