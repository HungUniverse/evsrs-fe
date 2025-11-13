import { useCallback, useState } from "react";

export type SortValue = "name-asc" | "name-desc" | "created-desc" | "created-asc" | "updated-desc" | "updated-asc";

export function useCarManufactureTableState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("created-desc");

  const setPage = useCallback((page: number) => setPageNumber(page), []);

  return {
    pageNumber,
    pageSize,
    search,
    sort,
    setPageNumber: setPage,
    setPageSize,
    setSearch,
    setSort,
  } as const;
}

