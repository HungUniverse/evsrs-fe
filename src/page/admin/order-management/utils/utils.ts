import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";

export const STATUS_OPTIONS: { value: OrderBookingStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "READY_FOR_CHECKOUT", label: "Có thể nhận xe" },
  { value: "CHECKED_OUT", label: "Đã nhận xe" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "RETURNED", label: "Đã trả xe" },
  { value: "COMPLETED", label: "Hoàn tất" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUND_PENDING", label: "Chờ hoàn tiền" },
];

export const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID_DEPOSIT", label: "Đã trả cọc" },
  { value: "PAID_DEPOSIT_COMPLETED", label: "Đã trả đủ tiền nhận xe" },
  { value: "PAID_FULL", label: "Đã thanh toán đầy đủ" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
  { value: "FAILED", label: "Thất bại" },
];

export function getStatusVariant(status: OrderBookingStatus): string {
  switch (status) {
    case "PENDING":
      return "soft-yellow";
    case "CONFIRMED":
      return "soft-blue";
    case "READY_FOR_CHECKOUT":
      return "soft-purple";
    case "CHECKED_OUT":
      return "soft-indigo";
    case "IN_USE":
      return "soft-green";
    case "RETURNED":
      return "soft-orange";
    case "COMPLETED":
      return "soft-green";
    case "CANCELLED":
      return "soft-red";
    default:
      return "soft-gray";
  }
}

export function getPaymentStatusVariant(status: PaymentStatus): string {
  switch (status) {
    case "PENDING":
      return "soft-yellow";
    case "PAID_DEPOSIT":
    case "PAID_DEPOSIT_COMPLETED":
      return "soft-blue";
    case "PAID_FULL":
    case "COMPLETED":
      return "soft-green";
    case "REFUNDED":
      return "soft-orange";
    case "FAILED":
      return "soft-red";
    default:
      return "soft-gray";
  }
}

export function getStatusLabel(status: OrderBookingStatus): string {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;
}

