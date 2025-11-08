import { useRenterTable } from "./hooks/use-renter-table";
import { RenterTableToolbar } from "./components/toolbar";
import { RenterTableContent } from "./components/table-content";
import { RenterTableLoadingState } from "./components/loading-state";
import { ImageModal } from "./components/image-modal";
import { DocumentVerificationModal } from "./components/document-verification-modal";
import { StatusChangeDialog } from "./components/status-change-dialog";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";

export default function RenterManagementPage() {
  const controller = useRenterTable();

  const {
    loading,
    rows,
    query,
    setQuery,
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
    documents,
    loadUserDocument,
    imageModal,
    setImageModal,
    documentDialog,
    setDocumentDialog,
    verificationNotes,
    setVerificationNotes,
    statusChangeDialog,
    setStatusChangeDialog,
    deleteDialog,
    openDeleteDialog,
    openDeleteDialogForUser,
    closeDeleteDialog,
    confirmDeleteUsers,
    isDeleting,
    handleDocumentVerification,
    handleStatusToggle,
    confirmStatusChange,
    confirmDocumentVerification,
  } = controller;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người thuê</h1>
        <p className="text-muted-foreground">Quản lý thông tin và trạng thái người thuê trong hệ thống</p>
      </div>

      {loading ? (
        <RenterTableLoadingState />
      ) : (
        <div className="space-y-4">
          <RenterTableToolbar
            query={query}
            onQueryChange={setQuery}
            sortState={sortState}
            onSortChange={setSortState}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            selectedCount={selectedCount}
            isAnySelected={isAnySelected}
            onDeleteSelected={openDeleteDialog}
          />

          <RenterTableContent
            rows={rows}
            selected={selected}
            onToggleSelect={toggleSelect}
            expandedRow={expandedRow}
            onToggleExpand={(userId) => {
              toggleExpandedRow(userId);
              if (expandedRow !== userId && documents[userId] === undefined) {
                loadUserDocument(userId);
              }
            }}
            documents={documents}
            onStatusToggle={handleStatusToggle}
            onVerification={handleDocumentVerification}
            onRequestDelete={openDeleteDialogForUser}
            onImageClick={setImageModal}
          />

          <ImageModal
            isOpen={!!imageModal}
            onClose={() => setImageModal(null)}
            imageUrl={imageModal?.url || null}
            title={imageModal?.title || null}
          />

          <DocumentVerificationModal
            isOpen={!!documentDialog.user}
            onClose={() => setDocumentDialog({ user: null, document: null, action: "approve" })}
            user={documentDialog.user}
            document={documentDialog.document}
            action={documentDialog.action}
            onActionChange={(action) => setDocumentDialog({ ...documentDialog, action })}
            verificationNotes={verificationNotes}
            onNotesChange={setVerificationNotes}
            onConfirm={confirmDocumentVerification}
          />

          <StatusChangeDialog
            isOpen={!!statusChangeDialog}
            onClose={() => setStatusChangeDialog(null)}
            user={statusChangeDialog?.user || null}
            document={statusChangeDialog?.document || null}
            newStatus={statusChangeDialog?.newStatus || "APPROVED"}
            currentStatus={statusChangeDialog?.currentStatus || "PENDING"}
            verificationNotes={verificationNotes}
            onNotesChange={setVerificationNotes}
            onConfirm={confirmStatusChange}
          />

          <DeleteConfirmationDialog
            isOpen={deleteDialog.isOpen}
            onClose={closeDeleteDialog}
            onConfirm={confirmDeleteUsers}
            users={deleteDialog.users}
            isDeleting={isDeleting}
          />
        </div>
      )}
    </div>
  );
}
