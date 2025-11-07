import { useModelsList } from "@/hooks/use-models";
import { useModelTableState } from "@/hooks/use-model-table-state";
import { useModelForm } from "@/hooks/use-model-form";
import { useModelDropdowns } from "@/hooks/use-model-dropdowns";
import PageShell from "./components/page-shell";
import HeaderActions from "./components/header-actions";
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

  return (
    <PageShell
      title="Quản lý model xe"
      subtitle="Quản lý model xe để quản lý các model xe trên hệ thống."
      actions={<HeaderActions onAdd={form.startCreate} />}
    >
      <div className="space-y-4">
        <FilterBar
          search={tableState.search}
          onSearchChange={tableState.setSearch}
          sort={tableState.sort}
          onSortChange={tableState.setSort}
          manufacturerCarId={tableState.manufacturerCarId}
          onManufacturerChange={tableState.setManufacturerCarId}
          manufacturers={manufacturers}
        />

        <ModelTable
          data={data?.items || []}
          manufacturers={manufacturers}
          amenities={amenities}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
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

        {(isLoading || isLoadingDropdowns) ? (
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        ) : null}
      </div>
    </PageShell>
  );
}
