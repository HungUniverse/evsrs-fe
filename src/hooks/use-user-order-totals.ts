import { useQuery } from "@tanstack/react-query";
import { orderBookingAPI } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { ID } from "@/@types/common/pagination";

export function useUserOrderTotals(userIds: ID[]) {
  return useQuery({
    queryKey: ["user-order-totals", userIds],
    queryFn: async (): Promise<Record<ID, number>> => {
      const totals: Record<ID, number> = {};

      const results = await Promise.all(
        userIds.map(async (userId) => {
          const response = await orderBookingAPI.getByUserId(userId);
          const orders = (response.data?.data || []) as OrderBookingDetail[];

          const total = orders.reduce((sum, order) => {
            const amount = Number(order.totalAmount ?? 0);
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);

          return { userId, total };
        })
      );

      results.forEach(({ userId, total }) => {
        totals[userId] = total;
      });

      return totals;
    },
    enabled: userIds.length > 0,
  });
}
