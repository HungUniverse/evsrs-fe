import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MembershipConfigAPI } from "@/apis/membership-config.api";
import type { MembershipConfigRequest } from "@/@types/membership";
import type { ID } from "@/@types/common/pagination";
import { toast } from "sonner";

const queryKeys = {
  list: () => ["membership-configs", "list"] as const,
  byId: (id: ID) => ["membership-configs", id] as const,
  byLevel: (level: string) => ["membership-configs", "level", level] as const,
};

export function useMembershipConfigs() {
  return useQuery({
    queryKey: queryKeys.list(),
    queryFn: () => MembershipConfigAPI.getConfigs(),
  });
}

export function useMembershipConfigMutations() {
  const qc = useQueryClient();

  const invalidateList = () => {
    qc.invalidateQueries({ queryKey: ["membership-configs", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: MembershipConfigRequest) => MembershipConfigAPI.createConfig(data),
    onSuccess: () => {
      invalidateList();
      toast.success("Hạng thành viên đã được tạo thành công!");
    },
    onError: () => {
      toast.error("Tạo hạng thành viên thất bại");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: ID; data: { discountPercent: number; requiredAmount: number } }) =>
      MembershipConfigAPI.updateConfig(id, data),
    onSuccess: () => {
      invalidateList();
      toast.success("Hạng thành viên đã được cập nhật thành công!");
    },
    onError: () => {
      toast.error("Cập nhật hạng thành viên thất bại");
    },
  });

  const remove = useMutation({
    mutationFn: (id: ID) => MembershipConfigAPI.deleteConfig(id),
    onSuccess: () => {
      invalidateList();
      toast.success("Hạng thành viên đã được xóa thành công!");
    },
    onError: () => {
      toast.error("Xóa hạng thành viên thất bại");
    },
  });

  return { create, update, remove };
}

