import { useQuery } from "@tanstack/react-query";
import type { ID } from "@/@types/common/pagination";
import type { MyMembershipResponse } from "@/@types/membership";
import { UserMembershipApi } from "../apis/user-membership.api";

export function useUserMemberships(userIds: ID[]) {
  return useQuery({
    queryKey: ["admin-user-memberships", userIds],
    enabled: userIds.length > 0,
    queryFn: async (): Promise<Record<ID, MyMembershipResponse | null>> => {
      const results: Record<ID, MyMembershipResponse | null> = {};

      const promises = userIds.map(async (userId) => {
        try {
          const membership = await UserMembershipApi.getByUserId(userId);
          return { userId, membership };
        } catch (error) {
          console.warn(`Failed to fetch membership for user ${userId}:`, error);
          return { userId, membership: null };
        }
      });

      const settled = await Promise.allSettled(promises);
      settled.forEach((item) => {
        if (item.status === "fulfilled") {
          const { userId, membership } = item.value;
          results[userId] = membership;
        } else {
          console.error("Fetch membership failed:", item.reason);
        }
      });

      return results;
    },
  });
}

