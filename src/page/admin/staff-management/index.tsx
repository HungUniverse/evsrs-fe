import { useState } from "react";
import { useStaffTable } from "./hooks/use-staff-table";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import { StaffTableToolbar } from "./components/toolbar";
import { StaffTableContent } from "./components/table-content";
import { StaffTableLoadingState } from "./components/loading-state";
import { ChangeDepotDialog } from "./components/change-depot-dialog";
import { CreateStaffDialog } from "./components/create-staff-dialog";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";

export default function StaffManagementPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const controller = useStaffTable();
  const {
    loading,
    rows,
    query,
    setQuery,
    selectedDepotId,
    setSelectedDepotId,
    sortState,
    setSortState,
    hasActiveFilters,
    clearFilters,
    selected,
    toggleSelect,
    selectedCount,
    isAnySelected,
    expandedRow,
    toggleExpandedRow,
    deleteDialog,
    openDeleteDialog,
    openDeleteDialogForUser,
    closeDeleteDialog,
    confirmDeleteUsers,
    isDeleting,
    changeDepotDialog,
    openChangeDepotForUser,
    closeChangeDepotDialog,
    setChangeDepotSelectedId,
    confirmChangeDepot,
    depotList,
    depotMap,
    isCreating,
    createDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    handleCreateStaff,
    form,
    getDepotName,
  } = controller;

  const pagination = useTablePagination({
    items: rows,
    pageNumber,
    pageSize,
    setPageNumber,
  });

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và trạng thái nhân viên trong hệ thống
        </p>
      </div>

      {loading ? (
        <StaffTableLoadingState />
      ) : (
        <div className="space-y-4">
          <StaffTableToolbar
            query={query}
            onQueryChange={(v) => {
              setQuery(v);
              setPageNumber(1);
            }}
            selectedDepotId={selectedDepotId}
            onSelectedDepotIdChange={(v) => {
              setSelectedDepotId(v);
              setPageNumber(1);
            }}
            depotList={depotList}
            sortState={sortState}
            onSortChange={(v) => {
              setSortState(v);
              setPageNumber(1);
            }}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={() => {
              clearFilters();
              setPageNumber(1);
            }}
            onOpenCreate={openCreateDialog}
            selectedCount={selectedCount}
            isAnySelected={isAnySelected}
            onDeleteSelected={openDeleteDialog}
          />

          <StaffTableContent
            rows={pagination.paginatedData}
            selected={selected}
            onToggleSelect={toggleSelect}
            expandedRow={expandedRow}
            onToggleExpand={toggleExpandedRow}
            getDepotName={getDepotName}
            depotMap={depotMap}
            onChangeDepot={openChangeDepotForUser}
            onRequestDelete={openDeleteDialogForUser}
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
            loading={loading}
          />

          <DeleteConfirmationDialog
            isOpen={deleteDialog.isOpen}
            onClose={closeDeleteDialog}
            onConfirm={confirmDeleteUsers}
            users={deleteDialog.users}
            isDeleting={isDeleting}
          />

          <ChangeDepotDialog
            isOpen={changeDepotDialog.isOpen}
            user={changeDepotDialog.user}
            selectedDepotId={changeDepotDialog.selectedDepotId}
            depotList={depotList}
            onDepotChange={setChangeDepotSelectedId}
            onClose={closeChangeDepotDialog}
            onConfirm={confirmChangeDepot}
            isSubmitting={changeDepotDialog.isSubmitting}
          />

          <CreateStaffDialog
            isOpen={createDialogOpen}
            onOpenChange={(open) => (open ? openCreateDialog() : closeCreateDialog())}
            onClose={closeCreateDialog}
            form={form}
            depotList={depotList}
            onSubmit={handleCreateStaff}
            isSubmitting={isCreating}
          />
        </div>
      )}
    </div>
  );
}
