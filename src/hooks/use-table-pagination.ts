import { useMemo } from "react";

export interface UseTablePaginationOptions<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  setPageNumber: (page: number) => void;
}

export interface UseTablePaginationResult<T> {
  paginatedData: T[];
  totalItems: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleFilterChange: <V>(setter: (v: V) => void) => (v: V) => void;
}

/**
 * Hook chung cho pagination của table
 * @param options - Options cho pagination
 * @returns Pagination result với các helper functions
 */
export function useTablePagination<T>({
  items,
  pageNumber,
  pageSize,
  setPageNumber,
}: UseTablePaginationOptions<T>): UseTablePaginationResult<T> {
  const paginatedData = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, pageNumber, pageSize]);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalItems);
  const hasNextPage = pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  const handlePreviousPage = () => {
    setPageNumber(Math.max(pageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(Math.min(pageNumber + 1, totalPages));
  };

  const handleFilterChange = <V,>(setter: (v: V) => void) => {
    return (v: V) => {
      setter(v);
      setPageNumber(1);
    };
  };

  return {
    paginatedData,
    totalItems,
    totalPages,
    startItem,
    endItem,
    currentPage: pageNumber,
    hasNextPage,
    hasPreviousPage,
    handlePreviousPage,
    handleNextPage,
    handleFilterChange,
  };
}

