import { useCarEVsList } from "@/hooks/use-car-evs";
import { useCarEVTableState } from "@/hooks/use-car-ev-table-state";
import { useCarEVForm } from "@/hooks/use-car-ev-form";
import { useCarEVDropdowns } from "@/hooks/use-car-ev-dropdowns";
import { useCarEVPagination } from "@/hooks/use-car-ev-pagination";
import type { CarEV } from "@/@types/car/carEv";
import PageShell from "./components/page-shell";
import FilterBar from "./components/filter-bar";
import CarEVTable from "./components/car-ev-table";
import CarEVFormDialog from "./components/car-ev-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";
import Pagination from "./components/pagination";

export default function CarEVManagementPage() {
  const tableState = useCarEVTableState();
  const { data, isLoading } = useCarEVsList({
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    search: tableState.search,
    sort: tableState.sort,
    depotId: tableState.depotId === "all" ? undefined : tableState.depotId,
    modelId: tableState.modelId === "all" ? undefined : tableState.modelId,
    status: tableState.status === "all" ? undefined : tableState.status,
  });
  const form = useCarEVForm();
  const { depots, models, isLoading: isLoadingDropdowns } = useCarEVDropdowns();
  const pagination = useCarEVPagination((data?.items as CarEV[]) || [], tableState);

  return (
    <PageShell
      title="Quản lý xe điện"
      subtitle="Quản lý xe điện để quản lý các xe điện trên hệ thống."
    >
      <div className="space-y-4">
        <FilterBar
          search={tableState.search}
          onSearchChange={(v) => {
            tableState.setSearch(v);
            tableState.setPageNumber(1);
          }}
          sort={tableState.sort}
          onSortChange={tableState.setSort}
          depotId={tableState.depotId}
          onDepotChange={pagination.handleFilterChange(tableState.setDepotId)}
          modelId={tableState.modelId}
          onModelChange={pagination.handleFilterChange(tableState.setModelId)}
          status={tableState.status}
          onStatusChange={pagination.handleFilterChange(tableState.setStatus)}
          onClearFilters={tableState.clearFilters}
          depots={depots}
          models={models}
          onAdd={form.startCreate}
        />

        <CarEVTable
          data={pagination.paginatedData}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
        />

        <CarEVFormDialog
          open={form.open}
          onOpenChange={form.setOpen}
          initialData={form.editing || undefined}
          depots={depots}
          models={models}
          onSubmit={form.submit}
        />

        <DeleteConfirmationDialog
          open={form.deleteDialogOpen}
          onOpenChange={form.setDeleteDialogOpen}
          item={form.itemToDelete}
          onConfirm={form.confirmDelete}
          isDeleting={form.isDeleting}
        />

        {pagination.totalItems > 0 && (
          <Pagination
            currentPage={tableState.pageNumber}
            totalPages={pagination.totalPages}
            startItem={pagination.startItem}
            endItem={pagination.endItem}
            totalItems={pagination.totalItems}
            onPreviousPage={pagination.handlePreviousPage}
            onNextPage={pagination.handleNextPage}
          />
        )}

        {(isLoading || isLoadingDropdowns) ? (
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        ) : null}
      </div>
    </PageShell>
  );
}
