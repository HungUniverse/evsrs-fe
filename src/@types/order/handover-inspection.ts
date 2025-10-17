export interface HandoverInspectionRequest {
  orderBookingId: string;
  type: "HANDOVER";
  batteryPercent: string;
  odometer: string;
  images: string;
  notes: string;
  staffId: string;
}

export interface HandoverInspection extends HandoverInspectionRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}
