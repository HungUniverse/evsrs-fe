import { useSystemConfigsList } from "./hooks/use-system-configs";
import { useSystemConfigTableState } from "./hooks/use-system-config-table-state";
import { useSystemConfigForm } from "./hooks/use-system-config-form";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import PageShell from "./components/page-shell";
import FilterBar from "./components/filter-bar";
import SystemConfigTable from "./components/system-config-table";
import SystemConfigFormDialog from "./components/system-config-form-dialog";

export default function SystemConfigManagementPage() {
  const tableState = useSystemConfigTableState();
  const { data, isLoading } = useSystemConfigsList({
    key: tableState.searchKey || undefined,
    configType: tableState.configType,
  });
  const form = useSystemConfigForm();
  const pagination = useTablePagination({
    items: data?.items || [],
    pageNumber: tableState.pageNumber,
    pageSize: tableState.pageSize,
    setPageNumber: tableState.setPageNumber,
  });

  return (
    <PageShell
      title="Quản lý cấu hình hệ thống"
      subtitle="Quản lý các cấu hình hệ thống như cấu hình chung, cổng thanh toán, thông báo và bảo mật."
    >
      <div className="space-y-4">
        <FilterBar
          searchKey={tableState.searchKey}
          onSearchKeyChange={(v) => {
            tableState.setSearchKey(v);
            tableState.setPageNumber(1);
          }}
          configType={tableState.configType}
          onConfigTypeChange={(v) => {
            tableState.setConfigType(v);
            tableState.setPageNumber(1);
          }}
          onClearFilters={tableState.clearFilters}
        />

        <SystemConfigTable
          data={pagination.paginatedData}
          onEdit={form.startEdit}
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

        <SystemConfigFormDialog
          open={form.open}
          onOpenChange={form.setOpen}
          initialData={form.editing || undefined}
          onSubmit={form.submit}
        />
      </div>
    </PageShell>
  );
}

