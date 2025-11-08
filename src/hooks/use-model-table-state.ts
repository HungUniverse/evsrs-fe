import { useCallback, useState } from "react";

export type SortValue = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "range-asc" | "range-desc" | "created-desc" | "created-asc";

export function useModelTableState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("created-desc");
  const [manufacturerCarId, setManufacturerCarId] = useState<string>("");

  const setPage = useCallback((page: number) => setPageNumber(page), []);

  return {
    pageNumber,
    pageSize,
    search,
    sort,
    manufacturerCarId,
    setPageNumber: setPage,
    setPageSize,
    setSearch,
    setSort,
    setManufacturerCarId,
  } as const;
}

