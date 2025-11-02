import type { OrderBookingStatus } from "@/@types/enum";

export const TRIP_STATUS_PILL: Record<OrderBookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-sky-100 text-sky-700 border-sky-200",
  READY_FOR_CHECKOUT: "bg-purple-100 text-purple-700 border-purple-200",
  CHECKED_OUT: "bg-indigo-100 text-indigo-700 border-indigo-200",
  IN_USE: "bg-blue-100 text-blue-700 border-blue-200",
  RETURNED: "bg-teal-100 text-teal-700 border-teal-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
};

export const TRIP_STATUS_LABEL: Record<OrderBookingStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  READY_FOR_CHECKOUT: "Có thể nhận xe",
  CHECKED_OUT: "Đã nhận xe",
  IN_USE: "Đang sử dụng",
  RETURNED: "Đã trả xe",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};
