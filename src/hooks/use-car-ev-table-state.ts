import { useCallback, useState } from "react";

export type SortValue = "licensePlate" | "modelName" | "depotName" | "status" | "batteryHealth" | "createdAt" | "none";

export function useCarEVTableState() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("none");
  const [depotId, setDepotId] = useState<string>("all");
  const [modelId, setModelId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const setPage = useCallback((page: number) => setPageNumber(page), []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setDepotId("all");
    setModelId("all");
    setStatus("all");
    setSort("none");
    setPageNumber(1);
  }, []);

  return {
    pageNumber,
    pageSize,
    search,
    sort,
    depotId,
    modelId,
    status,
    setPageNumber: setPage,
    setPageSize,
    setSearch,
    setSort,
    setDepotId,
    setModelId,
    setStatus,
    clearFilters,
  } as const;
}

