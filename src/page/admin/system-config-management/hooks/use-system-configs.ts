import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemConfigApi } from "@/apis/system-config.api";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import type { SystemConfigType } from "@/@types/enum";

// Hook quản lý danh sách system configs (chỉ có update, không có create/delete)

export type SystemConfigsListParams = {
  key?: string;
  configType?: SystemConfigType;
};

const queryKeys = {
  list: (params: SystemConfigsListParams) => ["system-configs", "list", params] as const,
};

// Lấy danh sách system configs với filter
export function useSystemConfigsList(params: SystemConfigsListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      let items: SystemConfigTypeResponse[] = [];
      
      if (params.configType) {
        items = await SystemConfigApi.getByConfigType(params.configType);
      } else {
        const res = await SystemConfigApi.getAll();
        items = res.data.items || [];
      }
      
      if (params.key) {
        const searchKey = params.key.toLowerCase();
        items = items.filter((item) => 
          item.key.toLowerCase().includes(searchKey)
        );
      }
      
      return { items, meta: { total: items.length } };
    },
  });
}

// Mutation update cho system configs
export function useSystemConfigMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["system-configs", "list"] });
  };

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { key: string; value: string; configType: SystemConfigType } }) => 
      SystemConfigApi.updateConfig(id, data),
    onSuccess: invalidateList,
  });

  return { update };
}

