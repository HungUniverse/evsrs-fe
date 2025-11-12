import { useCallback, useState } from "react";
import type { SystemConfigType } from "@/@types/enum";

/**
 * Hook quản lý state của table system config trong admin page
 * 
 * Mục đích: Quản lý các state liên quan đến table (pagination, filters)
 * - Pagination: pageNumber, pageSize
 * - Filters: searchKey, configType
 * - Helper: clearFilters để reset tất cả filters về mặc định
 * 
 * Pattern chung: Tương tự như use-depot-table-state, use-car-ev-table-state
 * Mỗi table management page sẽ có 1 hook table-state riêng để quản lý state của table đó
 * 
 * @returns { pageNumber, pageSize, searchKey, configType, setPageNumber, setPageSize, setSearchKey, setConfigType, clearFilters }
 * 
 * @example
 * const tableState = useSystemConfigTableState();
 * // Sử dụng trong component
 * <FilterBar
 *   searchKey={tableState.searchKey}
 *   onSearchKeyChange={tableState.setSearchKey}
 *   configType={tableState.configType}
 *   onConfigTypeChange={tableState.setConfigType}
 * />
 */
export function useSystemConfigTableState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [configType, setConfigType] = useState<SystemConfigType | "">("");

  const setPage = useCallback((page: number) => setPageNumber(page), []);

  const clearFilters = useCallback(() => {
    setSearchKey("");
    setConfigType("");
    setPageNumber(1);
  }, []);

  return {
    pageNumber,
    pageSize,
    searchKey,
    configType: configType || undefined,
    setPageNumber: setPage,
    setPageSize,
    setSearchKey,
    setConfigType,
    clearFilters,
  } as const;
}

