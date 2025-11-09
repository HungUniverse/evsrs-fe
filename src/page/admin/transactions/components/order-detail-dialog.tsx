import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import { Loader2 } from "lucide-react";
import { getStatusLabel, getPaymentStatusLabel, getStatusVariant, getPaymentStatusVariant } from "@/page/admin/order-management/utils/utils";

const PAYMENT_METHOD_OPTIONS = [
  { value: "BANKING", label: "Chuyển khoản ngân hàng" },
  { value: "CASH", label: "Tiền mặt" },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: "DEPOSIT", label: "Đặt cọc" },
  { value: "FULL", label: "Thanh toán đầy đủ" },
];

interface OrderDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderBookingDetail | null;
  loading?: boolean;
  orderId?: string;
  onFetchOrder?: (orderId: string) => Promise<void>;
}

export function OrderDetailDialog({ isOpen, onClose, order, loading = false, orderId, onFetchOrder }: OrderDetailDialogProps) {
  const fetchedOrderIdRef = useRef<string | null>(null);

  // Format depot address
  const formatDepotAddress = () => {
    if (!order?.depot) return "—";
    const parts = [];
    if (order.depot.street) parts.push(order.depot.street);
    if (order.depot.ward) {
      const ward = order.depot.ward.toLowerCase().startsWith("ward") 
        ? order.depot.ward 
        : `Ward ${order.depot.ward}`;
      parts.push(ward);
    }
    if (order.depot.district) parts.push(order.depot.district);
    if (order.depot.province) parts.push(order.depot.province);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  // Fetch order detail when dialog opens and orderId changes
  useEffect(() => {
    if (isOpen && orderId && onFetchOrder) {
      // Only fetch if this orderId hasn't been fetched yet, or if it's different from the last fetched one
      if (fetchedOrderIdRef.current !== orderId && !loading) {
        fetchedOrderIdRef.current = orderId;
        onFetchOrder(orderId);
      }
    }
    
    // Reset ref when dialog closes
    if (!isOpen) {
      fetchedOrderIdRef.current = null;
    }
  }, [isOpen, orderId, onFetchOrder, loading]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn đặt xe</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Đang tải thông tin đơn hàng...</p>
            </div>
          </div>
        ) : !order ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Không tìm thấy thông tin đơn hàng</p>
          </div>
        ) : (
          <div className="space-y-6">
          {/* Order Header */}
          <div className="w-full rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 dark:bg-blue-950 dark:border-blue-800">
            <span className="text-sm text-muted-foreground">Mã đơn hàng: </span>
            <span className="text-base font-semibold text-blue-900 dark:text-blue-100">{order.code || "N/A"}</span>
          </div>

          {/* Car Image */}
          {order.carEvs?.model?.image && (
            <div className="flex justify-center">
              <img
                src={order.carEvs.model.image}
                alt={order.carEvs.model.modelName}
                className="w-full max-h-60 object-cover rounded-lg shadow-md border"
              />
            </div>
          )}

          {/* Customer Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Thông tin khách hàng
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Người dùng</Label>
                <p className="text-sm font-medium mt-1">{order.user?.fullName || order.user?.userName || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <p className="text-sm mt-1">{order.user?.userEmail || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Điện thoại</Label>
                <p className="text-sm mt-1">{order.user?.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Thông tin đặt xe
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Ngày bắt đầu</Label>
                <p className="text-sm font-medium mt-1">{formatDate(order.startAt)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Ngày kết thúc</Label>
                <p className="text-sm font-medium mt-1">{formatDate(order.endAt)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Trạng thái</Label>
                <div className="mt-1">
                  <Badge
                    variant={getStatusVariant(order.status) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray"}
                    className="whitespace-nowrap"
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-100 dark:bg-green-950 dark:border-green-800">
              <div className="col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Tình trạng thanh toán</Label>
                <div className="mt-1">
                  <Badge
                    variant={getPaymentStatusVariant(order.paymentStatus) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray"}
                    className="whitespace-nowrap"
                  >
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Phương thức thanh toán</Label>
                <p className="text-sm mt-1">
                  {PAYMENT_METHOD_OPTIONS.find((m) => m.value === order.paymentMethod)?.label || order.paymentMethod}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Loại thanh toán</Label>
                <p className="text-sm mt-1">
                  {PAYMENT_TYPE_OPTIONS.find((t) => t.value === order.paymentType)?.label || order.paymentType}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Tổng tiền</Label>
                <p className="text-base font-bold text-green-700 dark:text-green-400 mt-1">
                  {vnd(parseFloat(order.totalAmount))} VNĐ
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Tiền cọc</Label>
                <p className="text-sm font-medium mt-1">{vnd(parseFloat(order.depositAmount))} VNĐ</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Số tiền hoàn</Label>
                <p className="text-sm mt-1">{vnd(parseFloat(order.refundAmount || "0"))} VNĐ</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Car Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Thông tin xe
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100 dark:bg-purple-950 dark:border-purple-800">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Xe</Label>
                <p className="text-sm font-medium mt-1">{order.carEvs?.model?.modelName || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Biển số xe</Label>
                <p className="text-sm font-medium mt-1">{order.carEvs?.licensePlate || "N/A"}</p>
              </div>
              <div className="col-span-2 flex flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-xs font-medium text-muted-foreground">Trạm xe điện</Label>
                  <p className="text-sm font-medium mt-1">{order.depot?.name || "N/A"}</p>
                </div>
                <div className="flex-1">
                  <Label className="text-xs font-medium text-muted-foreground">Địa chỉ</Label>
                  <p className="text-sm mt-1">{formatDepotAddress()}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* System Information Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Thông tin hệ thống
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Ngày tạo</Label>
                <p className="text-sm mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Ngày cập nhật</Label>
                <p className="text-sm mt-1">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {order.note && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Ghi chú
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{order.note}</p>
                </div>
              </div>
            </>
          )}
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

