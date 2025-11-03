import type {
  SepayCreateRemainQR,
  SepayCreateSettlementQR,
  SepaySettlementQRResponse,
  SepayStatusResponse,
} from "@/@types/payment/sepay";
import { api } from "@/lib/axios/axios";

export const checkSepayOrderStatus = async (
  orderId: string
): Promise<SepayStatusResponse> => {
  const res = await api.get<SepayStatusResponse>(
    `/api/sepay-auth/status/${orderId}`
  );
  return res.data;
};

export const generateSepayRemainQR = async (
  orderId: string
): Promise<SepayCreateRemainQR> => {
  const res = await api.get<SepayCreateRemainQR>(
    `/api/sepay-auth/generate-remaining-qr/${orderId}`
  );
  return res.data;
};

export const generateSepayQR = async (
  orderId: string
): Promise<SepayCreateRemainQR> => {
  const res = await api.get<SepayCreateRemainQR>(
    `/api/sepay-auth/generate-qr/${orderId}`
  );
  return res.data;
};
export const generateSepaySettlementQR = async (
  id: string
): Promise<SepayCreateSettlementQR> => {
  const res = await api.post<SepayCreateSettlementQR>(
    `/api/Return/settlement/${id}/sepay-qr`
  );
  return res.data;
};

export const checkSepaySettlementStatus = async (
  id: string
): Promise<SepaySettlementQRResponse> => {
  const res = await api.get<SepaySettlementQRResponse>(
    `/api/Return/settlement/${id}/payment-status`
  );
  return res.data;
};
