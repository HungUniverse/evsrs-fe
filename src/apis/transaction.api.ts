import type { TransactionResponse } from "@/@types/payment/transaction";
import { api } from "@/lib/api";

export const getTransactionsByUserId = async (
  userId: string
): Promise<TransactionResponse[]> => {
  return api<TransactionResponse[]>(`/api/Transaction/user/${userId}`, {
    method: "GET",
  });
};
