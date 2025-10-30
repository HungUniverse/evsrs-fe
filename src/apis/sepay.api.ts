import type { SepayStatusResponse } from "@/@types/payment/sepay";
import { api } from "@/lib/api";

/**
 * Check payment status for an order via Sepay
 * @param orderId - The order ID to check payment status
 * @returns SepayStatusResponse with payment status
 */
export const checkSepayOrderStatus = async (
  orderId: string
): Promise<SepayStatusResponse> => {
  return api<SepayStatusResponse>(`api/sepay-auth/status/${orderId}`, {
    method: "GET",
  });
};
