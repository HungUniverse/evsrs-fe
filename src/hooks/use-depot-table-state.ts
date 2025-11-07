import { useCallback, useState } from "react";

export type SortValue = "name-asc" | "name-desc" | "province-asc" | "province-desc" | "district-asc" | "district-desc" | "openTime-asc" | "openTime-desc" | "created-desc" | "created-asc";

export function useDepotTableState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("created-desc");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const setPage = useCallback((page: number) => setPageNumber(page), []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setProvince("");
    setDistrict("");
    setWard("");
    setSort("created-desc");
    setPageNumber(1);
  }, []);

  return {
    pageNumber,
    pageSize,
    search,
    sort,
    province,
    district,
    ward,
    setPageNumber: setPage,
    setPageSize,
    setSearch,
    setSort,
    setProvince,
    setDistrict,
    setWard,
    clearFilters,
  } as const;
}

