import { useMemo } from "react";
import type { useDepotTableState } from "./use-depot-table-state";
import type { Depot } from "@/@types/car/depot";

type TableState = ReturnType<typeof useDepotTableState>;

export function useDepotPagination(items: Depot[], tableState: TableState) {
  const paginatedData = useMemo(() => {
    const startIndex = (tableState.pageNumber - 1) * tableState.pageSize;
    const endIndex = startIndex + tableState.pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, tableState.pageNumber, tableState.pageSize]);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / tableState.pageSize);
  const startItem = totalItems === 0 ? 0 : (tableState.pageNumber - 1) * tableState.pageSize + 1;
  const endItem = Math.min(tableState.pageNumber * tableState.pageSize, totalItems);

  const handlePreviousPage = () => {
    tableState.setPageNumber(Math.max(tableState.pageNumber - 1, 1));
  };

  const handleNextPage = () => {
    tableState.setPageNumber(Math.min(tableState.pageNumber + 1, totalPages));
  };

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    tableState.setPageNumber(1);
  };

  return {
    paginatedData,
    totalItems,
    totalPages,
    startItem,
    endItem,
    handlePreviousPage,
    handleNextPage,
    handleFilterChange,
  } as const;
}

