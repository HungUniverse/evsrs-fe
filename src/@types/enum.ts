export type OrderBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_OUT"
  | "IN_USE"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED";

// -------------------- OrderType --------------------
export type OrderType = "RENTAL" | "WARRANTY";

// -------------------- OTPType --------------------
export type OTPType = "REGISTER" | "FORGOT_PASSWORD" | "CHANGE_PHONE_NUMBER";

// -------------------- PaymentMethod --------------------
export type PaymentMethod = "BANKING" | "CASH";

// -------------------- PaymentStatus --------------------
export type PaymentStatus =
  | "PENDING"
  | "PAID_DEPOSIT"
  | "PAID_DEPOSIT_COMPLETED"
  | "PAID_FULL"
  | "COMPLETED"
  | "REFUNDED"
  | "FAILED";

// -------------------- PaymentType --------------------
export type PaymentType = "DEPOSIT" | "FULL";

// -------------------- SignStatus --------------------
export type SignStatus = "PENDING" | "SIGNED" | "CANCELED";

// -------------------- TokenType --------------------
export type TokenType = "REFRESH_TOKEN" | "ACCESS_TOKEN";

// -------------------- CarEvStatus --------------------
export type CarEvStatus =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "RESERVED"
  | "IN_USE"
  | "REPAIRING";

// -------------------- NotificationType --------------------
export type NotificationType =
  | "PAYMENT"
  | "BOOKING"
  | "REMINDER"
  | "SYSTEM"
  | "PROMOTION";

// -------------------- RoleCode --------------------
export type RoleCode = "ADMIN" | "USER" | "STAFF";
