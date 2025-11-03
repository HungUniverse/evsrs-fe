import type { UserFull } from "../auth.type";
import type { CarEV } from "../car/carEv";
import type { Depot } from "../car/depot";
import type {
  OrderBookingStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "../enum";

export type ID = string;
export type DateString = string;
export interface OrderBookingRequest {
  carEVDetailId: ID;
  depotId: ID;
  startAt: DateString;
  endAt: DateString;
  paymentMethod: "BANKING" | "CASH";
  paymentType: "DEPOSIT" | "FULL";
  note?: string;
  isOfflineBooking?: boolean;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
}
export interface OrderBookingResponse {
  data: {
    qrUrl: string;
    orderBooking: OrderBookingDetail;
  };
  message: string;
  statusCode: number;
  code: string;
}

export interface OrderBookingDetail {
  id: ID;
  userId: ID;
  user: UserFull;
  depotId: ID;
  depot: Depot;
  carEVDetailId: ID;
  carEvs: CarEV;
  startAt: DateString;
  endAt: DateString;
  checkOutedAt: DateString | null;
  returnedAt: DateString | null;
  status: OrderBookingStatus;
  code: string;
  subTotal: string;
  discount: string | null;
  depositAmount: string;
  totalAmount: string;
  remainingAmount: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  note: string;
  refundAmount: string;
  createdAt: DateString;
  updatedAt: DateString;
  createdBy: string;
  updatedBy: string | null;
}
