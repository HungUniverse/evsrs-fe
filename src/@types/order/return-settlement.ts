import type { ID } from "./order-booking";

export interface SettlementItem {
  id: ID;
  returnSettlementId: ID;
  feeIncurred: string;
  description: string;
  discount: string;
  total: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ReturnSettlement {
  id: ID;
  orderBookingId: ID;
  calculateAt: string;
  subtotal: string;
  discount: string;

  total: string;
  notes: string;
  settlementItems: SettlementItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}

export interface ReturnSettlementRequest {
  orderBookingId?: ID;
  subtotal: string;
  discount: string;
  total: string;
  notes: string;
  settlementItems: {
    description: string;
    feeIncurred: string;
    discount: string;
    total: string;
    notes?: string;
  }[];
}
export interface ReturnSettlementResponse {
  data: ReturnSettlement;
  message: string;
  statusCode: number;
  code: string;
}
