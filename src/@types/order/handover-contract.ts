import type { User } from "../auth.type";
import type { SignStatus } from "../enum";
import type { OrderBookingDetail } from "./order-booking";

export interface CreateHandoverContractRequest {
  userId: string;
  orderBookingId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  fileUrl: string;
  signatureUrl: string;
  signStatus: SignStatus;
}
export interface HandoverContract {
  id: string;
  userId: string;
  orderBookingId: string;
  contractNumber: string;
  signedDate: string;
  startDate: string;
  endDate: string;
  fileUrl: string;
  signStatus: SignStatus;
  user: User;
  orderBooking: OrderBookingDetail;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}
