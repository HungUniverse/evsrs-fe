import { useMemo } from "react";
import type { useCarEVTableState } from "./use-car-ev-table-state";
import type { CarEV } from "@/@types/car/carEv";

type TableState = ReturnType<typeof useCarEVTableState>;

export function useCarEVPagination(items: CarEV[], tableState: TableState) {
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

