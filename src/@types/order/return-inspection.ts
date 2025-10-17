export interface ReturnInspectionRequest {
  orderBookingId: string;
  type: "RETURN";
  batteryPercent: string;
  odometer: string;
  images: string;
  notes: string;
  staffId: string;
}

export interface ReturnInspection extends ReturnInspectionRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}
