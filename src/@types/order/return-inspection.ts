import type { ID } from "./order-booking";

export interface ReturnInspectionRequest {
  orderBookingId: string;
  type: "RETURN";
  batteryPercent: string;
  odometer: string;
  images: string;
  notes: string;
  staffId: string;
}

export interface ReturnInspection {
  id: ID;
  orderBookingId: string;
  type: "RETURN";
  batteryPercent: string;
  odometer: string;
  images: string;
  notes: string;
  staffId: string;
}

export interface ReturnInspectionResponse {
  id: ID;
  orderBookingId: string;
  type: "RETURN";
  batteryPercent: string;
  odometer: string;
  images: string;
  notes: string;
  staffId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}
