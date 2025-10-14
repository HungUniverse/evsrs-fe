import type { ID } from "../order/order-booking";

export interface ReturnSettlementItemRequest {
  feeIncurred: string; // số tiền của item
  description: string; // mô tả
  discount: string; // mặc định "0"
  total: string; // = feeIncurred (nếu không áp discount riêng)
  notes: string; // để trống
}

export interface ReturnSettlementRequest {
  orderBookingId: ID;
  subtotal: string; // remainingAmount + sum(items)
  discount: string; // "0"
  total: string; // = subtotal - discount (ở đây = subtotal)
  notes: string; // ghi chú chung
  settlementItems: ReturnSettlementItemRequest[];
}

export interface ReturnSettlementItem extends ReturnSettlementItemRequest {
  id: string;
  returnSettlementId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ReturnSettlement extends ReturnSettlementRequest {
  id: string;
  calculateAt: string;
  settlementItems: ReturnSettlementItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}
