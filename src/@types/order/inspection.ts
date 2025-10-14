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
