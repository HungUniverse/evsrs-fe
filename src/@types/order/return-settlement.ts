export interface ReturnSettlementItemRequest {
  feeIncurred: string; // phí phát sinh (string số)
  description: string;
  discount: string; // giảm riêng của item
  total: string; // tổng của item (thường = feeIncurred - discount)
  notes: string;
}

export interface ReturnSettlementRequest {
  orderBookingId: string;
  subtotal: string; // số tiền còn lại phải trả (ví dụ remainingAmount)
  discount: string; // giảm tổng
  total: string; // subtotal + sum(items.total) - discount
  notes: string;
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
export interface ReturnSettlement
  extends Omit<ReturnSettlementRequest, "settlementItems"> {
  id: string;
  calculateAt: string; // BE trả ra
  settlementItems: ReturnSettlementItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}
