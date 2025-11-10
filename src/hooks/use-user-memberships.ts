import { useQuery } from "@tanstack/react-query";
import { MembershipAPI } from "@/apis/membership.api";
import type { MyMembershipResponse } from "@/@types/membership";
import type { ID } from "@/@types/common/pagination";

export function useUserMembership(userId: ID | null | undefined) {
  return useQuery({
    queryKey: ["user-membership", userId],
    queryFn: () => MembershipAPI.getByUserId(userId!),
    enabled: !!userId,
  });
}

export function useUserMemberships(userIds: ID[]) {
  return useQuery({
    queryKey: ["user-memberships", userIds],
    queryFn: async (): Promise<Record<ID, MyMembershipResponse | null>> => {
      const results: Record<ID, MyMembershipResponse | null> = {};
      
      // Fetch all memberships in parallel
      // Xử lý trường hợp API có thể trả về lỗi hoặc null cho user không có membership
      const promises = userIds.map(async (userId) => {
        try {
          const membership = await MembershipAPI.getByUserId(userId);
          return { userId, membership };
        } catch (error) {
          // Nếu API trả về lỗi (ví dụ user chưa có membership), trả về null
          console.warn(`Failed to fetch membership for user ${userId}:`, error);
          return { userId, membership: null };
        }
      });

      const resolved = await Promise.allSettled(promises);
      resolved.forEach((result) => {
        if (result.status === "fulfilled") {
          const { userId, membership } = result.value;
          results[userId] = membership;
        } else {
          // Xử lý trường hợp promise bị reject
          console.error("Failed to fetch membership:", result.reason);
        }
      });

      return results;
    },
    enabled: userIds.length > 0,
  });
}

