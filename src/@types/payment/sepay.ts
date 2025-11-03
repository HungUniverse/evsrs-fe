export interface SepayStatusResponse {
  data: null | {
    orderId: string;
    status: string;
    amount?: number;
    transactionId?: string;
    paidAt?: string;
  };
  message: string; // e.g., "PAID_DEPOSIT_COMPLETED", "PENDING", "FAILED"
  statusCode: number;
  code: string; // e.g., "SUCCESS", "ERROR"
}

export const SepayOrderStatus = {
  PAID_DEPOSIT: "PAID_DEPOSIT",
  PAID_DEPOSIT_COMPLETED: "PAID_DEPOSIT_COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
  NOT_FOUND: "NOT_FOUND",
} as const;

export const SepaySettlementStatus = {
  PAID: "PAID",
  PENDING: "PENDING",
};
export type SepayOrderStatusType =
  (typeof SepayOrderStatus)[keyof typeof SepayOrderStatus];
export interface SepayCreateRemainQR {
  data: {
    qrUrl: string;
    orderbookingId: string;
  };
  message: string;
  statusCode: number;
  code: string;
}
export interface SepayCreateSettlementQR {
  data: string;
  message: string;
  statusCode: number;
  code: string;
}
export interface SepaySettlementQRResponse {
  data: {
    id: string;
    orderBookingId: string;
    paymentStatus: string;
    paymentMethod: string | null;
    paymentDate: string | null;
    total: string;
    isPaymentRequired: boolean;
    isPaymentOverdue: boolean;
    paymentDueDate: string | null;
    qrCodeUrl: string;
    createdAt: string;
    updatedAt: string;
    orderCode: string;
    customerName: string;
    customerPhone: string;
  };
  message: string;
  statusCode: number;
  code: string;
}
