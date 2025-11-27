import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { PaymentMethod, PaymentType } from "@/@types/enum";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import { getStatusVariant, getPaymentStatusVariant, getStatusLabel, getPaymentStatusLabel } from "../utils/utils";

const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    BANKING: "Chuyển khoản ngân hàng",
    CASH: "Tiền mặt",
  };
  return labels[method] || method;
};

const getPaymentTypeLabel = (type: PaymentType): string => {
  const labels: Record<PaymentType, string> = {
    DEPOSIT: "Đặt cọc",
    FULL: "Thanh toán đầy đủ",
  };
  return labels[type] || type;
};

interface OrderDetailsFullProps {
  booking: OrderBookingDetail;
}

export function OrderDetailsFull({ booking }: OrderDetailsFullProps) {
  // Format depot address
  const formatDepotAddress = () => {
    const parts = [];
    if (booking.depot?.street) parts.push(booking.depot.street);
    if (booking.depot?.ward) {
      const ward = booking.depot.ward.toLowerCase().startsWith("ward") 
        ? booking.depot.ward 
        : `Ward ${booking.depot.ward}`;
      parts.push(ward);
    }
    if (booking.depot?.district) parts.push(booking.depot.district);
    if (booking.depot?.province) parts.push(booking.depot.province);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  return (
    <div className="space-y-6">
      {/* Car Image */}
      {booking.carEvs?.model?.image && (
        <div className="flex justify-center">
          <img
            src={booking.carEvs.model.image}
            alt={booking.carEvs.model.modelName}
            className="w-full max-h-60 object-cover rounded-lg shadow-md border"
          />
        </div>
      )}

      {/* Car Information Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Thông tin xe
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100 dark:bg-purple-950 dark:border-purple-800">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Xe</Label>
            <p className="text-sm font-medium mt-1">{booking.carEvs?.model?.modelName || "N/A"}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Biển số xe</Label>
            <p className="text-sm font-medium mt-1">{booking.carEvs?.licensePlate || "N/A"}</p>
          </div>
          <div className="col-span-2 flex flex-row gap-4">
            <div className="flex-1">
              <Label className="text-xs font-medium text-muted-foreground">Trạm xe điện</Label>
              <p className="text-sm font-medium mt-1">{booking.depot?.name || "N/A"}</p>
            </div>
            <div className="flex-1">
              <Label className="text-xs font-medium text-muted-foreground">Địa chỉ</Label>
              <p className="text-sm mt-1">{formatDepotAddress()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Thông tin khách hàng
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Người dùng</Label>
            <p className="text-sm font-medium mt-1">{booking.user?.fullName || booking.user?.userName || "N/A"}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Email</Label>
            <p className="text-sm mt-1">{booking.user?.userEmail || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Điện thoại</Label>
            <p className="text-sm mt-1">{booking.user?.phoneNumber || "N/A"}</p>
          </div>
        </div>
      </div>

      

      {/* Payment Information Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Thông tin thanh toán
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-100 dark:bg-green-950 dark:border-green-800">
          <div className="col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Tình trạng thanh toán</Label>
            <div className="mt-1">
              <Badge variant={(getPaymentStatusVariant(booking.paymentStatus) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}>
                {getPaymentStatusLabel(booking.paymentStatus)}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Phương thức thanh toán</Label>
            <p className="text-sm mt-1">
              {getPaymentMethodLabel(booking.paymentMethod)}
            </p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Loại thanh toán</Label>
            <p className="text-sm mt-1">
              {getPaymentTypeLabel(booking.paymentType)}
            </p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Tổng tiền</Label>
            <p className="text-base font-bold text-green-700 dark:text-green-400 mt-1">
              {vnd(parseFloat(booking.totalAmount))} VNĐ
            </p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Tiền cọc</Label>
            <p className="text-sm font-medium mt-1">{vnd(parseFloat(booking.depositAmount))} VNĐ</p>
          </div>
        </div>
      </div>

      {/* Booking Information Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Thông tin đặt xe
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Ngày bắt đầu</Label>
            <p className="text-sm font-medium mt-1">{formatDate(booking.startAt)}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Ngày kết thúc</Label>
            <p className="text-sm font-medium mt-1">{formatDate(booking.endAt)}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Trạng thái</Label>
            <div className="mt-1">
              <Badge variant={(getStatusVariant(booking.status) as "default" | "secondary" | "destructive" | "outline" | "soft-yellow" | "soft-blue" | "soft-purple" | "soft-indigo" | "soft-green" | "soft-orange" | "soft-red" | "soft-gray") || "default"}>
                {getStatusLabel(booking.status)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* System Information Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          Thông tin hệ thống
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Ngày tạo</Label>
            <p className="text-sm mt-1">{formatDate(booking.createdAt)}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Ngày cập nhật</Label>
            <p className="text-sm mt-1">{formatDate(booking.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {booking.note && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
            Ghi chú
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{booking.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}

