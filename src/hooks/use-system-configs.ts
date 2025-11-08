import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemConfig } from "@/apis/system-config.api";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import type { SystemConfigType } from "@/@types/enum";
import type { ListBaseResponse } from "@/@types/response";

export type SystemConfigsListParams = {
  key?: string;
  configType?: SystemConfigType;
};

const queryKeys = {
  list: (params: SystemConfigsListParams) => ["system-configs", "list", params] as const,
};

export function useSystemConfigsList(params: SystemConfigsListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      let items: SystemConfigTypeResponse[] = [];
      
      if (params.configType) {
        // Filter by config type
        items = await SystemConfig.getByConfigType(params.configType);
      } else {
        // Get all configs
        const res = await SystemConfig.getAll();
        items = res.data?.items || [];
      }
      
      // Client-side filter by key if provided
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

export function useSystemConfigMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["system-configs", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: { key: string; value: string; configType: SystemConfigType }) => 
      SystemConfig.createConfig(data),
    onSuccess: invalidateList,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { key: string; value: string; configType: SystemConfigType } }) => 
      SystemConfig.updateConfig(id, data),
    onSuccess: invalidateList,
  });

  const remove = useMutation({
    mutationFn: (id: string) => SystemConfig.deleteConfig(id),
    onSuccess: invalidateList,
  });

  return { create, update, remove };
}

