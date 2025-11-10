import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemConfigApi } from "@/apis/system-config.api";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import type { SystemConfigType } from "@/@types/enum";

/**
 * Hook để quản lý danh sách system configs trong admin page
 * 
 * Mục đích: Lấy danh sách configs để hiển thị/quản lý trong table admin
 * - Có query với filter (key, configType)
 * - Có mutations (create, update, delete)
 * - Tự động invalidate cache khi có thay đổi
 * 
 * Khác với use-system-config: Hook này dùng cho việc quản lý danh sách configs,
 * còn use-system-config dùng cho việc lấy 1 config value để sử dụng trong app
 * 
 * @example
 * const { data, isLoading } = useSystemConfigsList({ key: "search", configType: "GENERAL" });
 * const { create, update, remove } = useSystemConfigMutations();
 */

export type SystemConfigsListParams = {
  key?: string;
  configType?: SystemConfigType;
};

const queryKeys = {
  list: (params: SystemConfigsListParams) => ["system-configs", "list", params] as const,
};

/**
 * Hook để lấy danh sách system configs với filter
 */
export function useSystemConfigsList(params: SystemConfigsListParams) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: async () => {
      let items: SystemConfigTypeResponse[] = [];
      
      if (params.configType) {
        // Filter by config type
        items = await SystemConfigApi.getByConfigType(params.configType);
      } else {
        // Get all configs
        const res = await SystemConfigApi.getAll();
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

/**
 * Hook để thực hiện các mutations (create, update, delete) cho system configs
 * Tự động invalidate cache sau khi thực hiện thành công
 */
export function useSystemConfigMutations() {
  const qc = useQueryClient();
  const invalidateList = async () => {
    await qc.invalidateQueries({ queryKey: ["system-configs", "list"] });
  };

  const create = useMutation({
    mutationFn: (data: { key: string; value: string; configType: SystemConfigType }) => 
      SystemConfigApi.createConfig(data),
    onSuccess: invalidateList,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { key: string; value: string; configType: SystemConfigType } }) => 
      SystemConfigApi.updateConfig(id, data),
    onSuccess: invalidateList,
  });

  const remove = useMutation({
    mutationFn: (id: string) => SystemConfigApi.deleteConfig(id),
    onSuccess: invalidateList,
  });

  return { create, update, remove };
}

