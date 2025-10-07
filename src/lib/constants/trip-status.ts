export type TripStatus = "completed" | "cancelled" | "confirmed";

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  confirmed: "Xác nhận",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export const TRIP_STATUS_PILL: Record<TripStatus, string> = {
  confirmed: "bg-sky-100 text-sky-700 border-sky-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};
