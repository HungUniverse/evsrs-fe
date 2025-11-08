import type { ID, DateString } from "@/@types/common/pagination";

export interface MembershipLevel {
  id: ID;
  level: string;
  levelName: string;
  discountPercent: number;
  requiredAmount: number;
  createdAt: DateString;
  updatedAt: DateString;
}

export interface MyMembershipResponse {
  id: ID;
  userId: ID;
  userName: string;
  level: string;
  levelName: string;
  discountPercent: number;
  requiredAmount: number;
  totalOrderBill: number;
  progressToNextLevel: number;
  amountToNextLevel: number;
  nextLevelName: string | null;
  membershipConfigId: ID;
  createdAt: DateString;
  updatedAt: DateString;
}

export interface MembershipConfigRequest {
    level: string;
    discountPercent: number;
    requiredAmount: number;
}