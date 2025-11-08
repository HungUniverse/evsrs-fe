import { useCallback, useState } from "react";
import type { SystemConfigType } from "@/@types/enum";

export function useSystemConfigTableState() {
  const [searchKey, setSearchKey] = useState("");
  const [configType, setConfigType] = useState<SystemConfigType | "">("");

  const clearFilters = useCallback(() => {
    setSearchKey("");
    setConfigType("");
  }, []);

  return {
    searchKey,
    configType: configType || undefined,
    setSearchKey,
    setConfigType,
    clearFilters,
  } as const;
}

