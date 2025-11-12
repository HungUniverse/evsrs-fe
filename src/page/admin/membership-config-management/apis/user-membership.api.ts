import { api } from "@/lib/axios/axios";
import type { ID } from "@/@types/common/pagination";
import type { ItemBaseResponse } from "@/@types/response";
import type { MyMembershipResponse } from "@/@types/membership";

export const UserMembershipApi = {
  getByUserId: async (userId: ID): Promise<MyMembershipResponse> => {
    const response = await api.get<ItemBaseResponse<MyMembershipResponse>>(
      `/api/Membership/user/${userId}`
    );
    return response.data.data;
  },
};

