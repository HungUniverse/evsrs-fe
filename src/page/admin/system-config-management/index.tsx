import { useSystemConfigsList } from "@/hooks/use-system-configs";
import { useSystemConfigTableState } from "@/hooks/use-system-config-table-state";
import { useSystemConfigForm } from "@/hooks/use-system-config-form";
import PageShell from "./components/page-shell";
import HeaderActions from "./components/header-actions";
import FilterBar from "./components/filter-bar";
import SystemConfigTable from "./components/system-config-table";
import SystemConfigFormDialog from "./components/system-config-form-dialog";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";

export default function SystemConfigManagementPage() {
  const tableState = useSystemConfigTableState();
  const { data, isLoading } = useSystemConfigsList({
    key: tableState.searchKey || undefined,
    configType: tableState.configType,
  });
  const form = useSystemConfigForm();

  return (
    <PageShell
      title="Quản lý cấu hình hệ thống"
      subtitle="Quản lý các cấu hình hệ thống như cấu hình chung, cổng thanh toán, thông báo và bảo mật."
      actions={<HeaderActions onAdd={form.startCreate} />}
    >
      <div className="space-y-4">
        <FilterBar
          searchKey={tableState.searchKey}
          onSearchKeyChange={tableState.setSearchKey}
          configType={tableState.configType}
          onConfigTypeChange={tableState.setConfigType}
          onClearFilters={tableState.clearFilters}
        />

        <SystemConfigTable
          data={data?.items || []}
          onEdit={form.startEdit}
          onDelete={form.startDelete}
        />

        <SystemConfigFormDialog
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

        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Đang tải dữ liệu...
          </p>
        )}
      </div>
    </PageShell>
  );
}

