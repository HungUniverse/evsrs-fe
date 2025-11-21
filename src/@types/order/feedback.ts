import type { ID } from "../common/pagination";

export interface FeedBack {
  id: ID;
  orderBookingId: ID;
  userId: string;
  rated: string;
  description: string;
  images: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
export interface FeedbackRequest {
  orderBookingId: ID;
  rated: string;
  description: string;
  images: string | null;
}
