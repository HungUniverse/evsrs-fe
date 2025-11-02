import type {
  SepayCreateRemainQR,
  SepayStatusResponse,
} from "@/@types/payment/sepay";
import { api } from "@/lib/api";

export const checkSepayOrderStatus = async (
  orderId: string
): Promise<SepayStatusResponse> => {
  return api<SepayStatusResponse>(`api/sepay-auth/status/${orderId}`, {
    method: "GET",
  });
};
export const generateSepayRemainQR = async (
  orderId: string
): Promise<SepayCreateRemainQR> => {
  return api<SepayCreateRemainQR>(
    `api/sepay-auth/generate-remaining-qr/${orderId}`,
    {
      method: "GET",
    }
  );
};
