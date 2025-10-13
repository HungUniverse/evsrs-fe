import type { RoleCode, UserFull } from "../auth.type";
import type { CarEV } from "../car/carEv";
import type { Depot } from "../car/depot";
import type { PaymentStatus, SignStatus } from "../enum";

/** User rút gọn nằm trong OrderBooking của Contract */
export interface ContractUserLite {
  id: string;
  userName: string;
  userEmail: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  fullName: string | null;
  role: RoleCode | string;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}
/** OrderBooking rút gọn kèm user */
export interface ContractOrderBooking {
  id: string;
  userId: string;
  user: ContractUserLite | null;

  depotId: string;
  depot: Depot | null; // BE trả null trong mẫu
  carEVDetailId: string;
  carEvs: CarEV | null; // BE trả null trong mẫu

  startAt: string;
  endAt: string;
  checkOutedAt: string | null;
  returnedAt: string | null;

  status: string; // "CONFIRMED", ...
  subTotal: string; // BE trả dạng string
  discount: string | null;
  depositAmount: string;
  totalAmount: string;
  remainingAmount: string;

  paymentMethod: string;
  paymentType: "Deposit";
  paymentStatus: PaymentStatus;

  note: string | null;

  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface Contract {
  id: string;
  userId: string;
  orderBookingId: string;

  contractNumber: string;
  signedDate: string | null;
  startDate: string;
  endDate: string;

  fileUrl: string;
  signatureUrl: string | null;
  signStatus: SignStatus;

  user: UserFull | null; // BE trả null trong mẫu
  orderBooking: ContractOrderBooking | null;

  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}
