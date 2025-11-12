import { useAmenitiesList } from "@/hooks/use-amenities";
import { useAmenitiesTableState } from "@/hooks/use-amenities-table-state";
import { useAmenityForm } from "@/hooks/use-amenity-form";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import PageShell from "./components/page-shell";
import FilterBar from "./components/filter-bar";
import AmenityTable from "./components/amenity-table";
import AmenityFormDialog from "./components/amenity-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";

export default function AmenitiesManagementPage() {
  const tableState = useAmenitiesTableState();
  const { data, isLoading } = useAmenitiesList({
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    search: tableState.search,
    sort: tableState.sort,
  });
  const form = useAmenityForm();
  const pagination = useTablePagination({
    items: data?.items || [],
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    setPageNumber: tableState.setPageNumber,
  });

  return (
    <PageShell
      title="Quản lý tiện nghi"
      subtitle="Quản lý tiện nghi khả dụng trên xe ô tô."
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
          onAddClick={form.startCreate}
        />

        <AmenityTable
          data={pagination.paginatedData}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
          startIndex={pagination.startItem}
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

        <AmenityFormDialog
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
      </div>
    </PageShell>
  );
}
