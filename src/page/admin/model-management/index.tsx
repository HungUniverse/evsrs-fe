import { useModelsList } from "@/hooks/use-models";
import { useModelTableState } from "@/hooks/use-model-table-state";
import { useModelForm } from "@/hooks/use-model-form";
import { useModelDropdowns } from "@/hooks/use-model-dropdowns";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import PageShell from "./components/page-shell";
import FilterBar from "./components/filter-bar";
import ModelTable from "./components/model-table";
import ModelFormDialog from "./components/model-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";

export default function ModelManagementPage() {
  const tableState = useModelTableState();
  const { data, isLoading } = useModelsList({
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    search: tableState.search,
    sort: tableState.sort,
    manufacturerCarId: tableState.manufacturerCarId || undefined,
  });
  const form = useModelForm();
  const { manufacturers, amenities, isLoading: isLoadingDropdowns } = useModelDropdowns();
  const pagination = useTablePagination({
    items: data?.items || [],
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    setPageNumber: tableState.setPageNumber,
  });

  return (
    <PageShell
      title="Quản lý model xe"
      subtitle="Quản lý model xe để quản lý các model xe trên hệ thống."
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
          manufacturerCarId={tableState.manufacturerCarId}
          onManufacturerChange={(v) => {
            tableState.setManufacturerCarId(v);
            tableState.setPageNumber(1);
          }}
          manufacturers={manufacturers}
          onAdd={form.startCreate}
        />

        <ModelTable
          data={pagination.paginatedData}
          manufacturers={manufacturers}
          amenities={amenities}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
        />

        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          totalItems={pagination.totalItems}
          onPreviousPage={pagination.handlePreviousPage}
          onNextPage={pagination.handleNextPage}
          loading={isLoading || isLoadingDropdowns}
        />

        <ModelFormDialog
          open={form.open}
          onOpenChange={form.setOpen}
          initialData={form.editing || undefined}
          manufacturers={manufacturers}
          amenities={amenities}
          onSubmit={form.submit}
        />

        <DeleteConfirmationDialog
          open={form.deleteDialogOpen}
          onOpenChange={form.setDeleteDialogOpen}
          item={form.itemToDelete}
          onConfirm={form.confirmDelete}
          isDeleting={form.isDeleting}
        />
      </div>
    </PageShell>
  );
}
