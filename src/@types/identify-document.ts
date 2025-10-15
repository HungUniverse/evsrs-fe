import type { User } from "./auth.type";
import type { IdentifyDocumentStatus } from "./enum";

export interface IdentifyUserSummary {
  id: string;
  user: User;
  isVerify: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface IdentifyDocumentRequest {
  userId: string;
  frontImage: string; // base64
  backImage: string; // base64
  countryCode: string;
  numberMasked: string;
  licenseClass: string;
  expireAt: string; // ISO 8601
  status: IdentifyDocumentStatus;
  verifiedBy?: string;
  verifiedAt?: string; // ISO 8601
  note?: string;
}

export interface IdentifyDocumentResponse {
  id: string;
  user: IdentifyUserSummary | null;
  frontImage: string | null;
  backImage: string | null;
  countryCode: string;
  numberMasked: string;
  licenseClass: string;
  expireAt: string;
  status: IdentifyDocumentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  isDeleted: boolean;
}
