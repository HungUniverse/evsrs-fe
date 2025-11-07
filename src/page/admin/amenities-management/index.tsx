import { useAmenitiesList } from "@/hooks/use-amenities";
import { useAmenitiesTableState } from "@/hooks/use-amenities-table-state";
import { useAmenityForm } from "@/hooks/use-amenity-form";
import PageShell from "./components/page-shell";
import HeaderActions from "./components/header-actions";
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

  return (
    <PageShell
      title="Quản lý tiện ích"
      subtitle="Quản lý tiện ích khả dụng trên xe ô tô."
      actions={<HeaderActions onAdd={form.startCreate} />}
    >
      <div className="space-y-4">
        <FilterBar
          search={tableState.search}
          onSearchChange={tableState.setSearch}
          sort={tableState.sort}
          onSortChange={tableState.setSort}
        />

        <AmenityTable
          data={data?.items || []}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
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

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        ) : null}
      </div>
    </PageShell>
  );
}
