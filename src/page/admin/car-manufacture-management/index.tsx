import { useCarManufacturesList } from "@/hooks/use-car-manufactures";
import { useCarManufactureTableState } from "@/hooks/use-car-manufacture-table-state";
import { useCarManufactureForm } from "@/hooks/use-car-manufacture-form";
import PageShell from "./components/page-shell";
import FilterBar from "./components/filter-bar";
import CarManufactureTable from "./components/car-manufacture-table";
import CarManufactureFormDialog from "./components/car-manufacture-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";

export default function CarManufactureManagementPage() {
  const tableState = useCarManufactureTableState();
  const { data, isLoading } = useCarManufacturesList({
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    search: tableState.search,
    sort: tableState.sort,
  });
  const form = useCarManufactureForm();

  return (
    <PageShell
      title="Quản lý nhà sản xuất xe"
      subtitle="Quản lý nhà sản xuất xe để quản lý các hãng xe trên hệ thống."
    >
      <div className="space-y-4">
        <FilterBar
          search={tableState.search}
          onSearchChange={tableState.setSearch}
          sort={tableState.sort}
          onSortChange={tableState.setSort}
          onAdd={form.startCreate}
        />

        <CarManufactureTable
          data={data?.items || []}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
        />

        <CarManufactureFormDialog
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
