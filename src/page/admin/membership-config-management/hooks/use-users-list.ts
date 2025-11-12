import { useQuery } from "@tanstack/react-query";
import { UserFullAPI } from "@/apis/user.api";
import type { UserFull } from "@/@types/auth.type";

export function useUsersList() {
  return useQuery({
    queryKey: ["users", "list", "USER"],
    queryFn: async (): Promise<UserFull[]> => {
      let allUsers: UserFull[] = [];
      let pageNumber = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await UserFullAPI.getAll(pageNumber, 100);
        const items = response.data.data.items;
        // Filter only users with role = "USER"
        const userRoleUsers = items.filter((user) => user.role === "USER");
        allUsers = [...allUsers, ...userRoleUsers];

        hasMore = pageNumber < response.data.data.totalPages;
        pageNumber++;
      }

      return allUsers;
    },
  });
}

