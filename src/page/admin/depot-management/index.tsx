import { useDepotsList } from "@/hooks/use-depots";
import { useDepotTableState } from "@/hooks/use-depot-table-state";
import { useDepotForm } from "@/hooks/use-depot-form";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import type { Depot } from "@/@types/car/depot";
import PageShell from "./components/page-shell";
import FilterBar from "./components/filter-bar";
import DepotTable from "./components/depot-table";
import DepotFormDialog from "./components/depot-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";

export default function DepotManagementPage() {
  const tableState = useDepotTableState();
  const { data, isLoading } = useDepotsList({
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    search: tableState.search,
    sort: tableState.sort,
    province: tableState.province || undefined,
    district: tableState.district || undefined,
    ward: tableState.ward || undefined,
  });
  const form = useDepotForm();
  const pagination = useTablePagination({
    items: (data?.items as Depot[]) || [],
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    setPageNumber: tableState.setPageNumber,
  });

  return (
    <PageShell
      title="Quản lý trạm"
      subtitle="Quản lý trạm để quản lý các trạm trên hệ thống."
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
          province={tableState.province}
          onProvinceChange={(v) => {
            tableState.setProvince(v);
            tableState.setPageNumber(1);
          }}
          district={tableState.district}
          onDistrictChange={(v) => {
            tableState.setDistrict(v);
            tableState.setPageNumber(1);
          }}
          ward={tableState.ward}
          onWardChange={(v) => {
            tableState.setWard(v);
            tableState.setPageNumber(1);
          }}
          onClearFilters={tableState.clearFilters}
          onAdd={form.startCreate}
        />

        <DepotTable
          data={pagination.paginatedData}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
          startIndex={pagination.startItem}
        />

        <DepotFormDialog
          open={form.open}
          onOpenChange={form.setOpen}
          initialData={form.editing || undefined}
          onSubmit={form.submit}
        />

        <DeleteConfirmationDialog
          open={form.deleteDialogOpen}
          onOpenChange={form.setDeleteDialogOpen}
          item={form.itemToDelete}
          onConfirm={form.confirmDelete}
          isDeleting={form.isDeleting}
        />

        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          totalItems={pagination.totalItems}
          onPreviousPage={pagination.handlePreviousPage}
          onNextPage={pagination.handleNextPage}
          onPageChange={pagination.setPageNumber}
          loading={isLoading}
        />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        ) : null}
      </div>
    </PageShell>
  );
}
