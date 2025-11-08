import { useOrderTable } from "./hooks/use-order-table";
import { OrderTableToolbar } from "./components/toolbar";
import { OrderTable } from "./components/table";
import { OrderTableLoadingState } from "./components/loading-state";
import { OrderDetailDialog } from "./components/detail-dialog";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { RefundDialog } from "./components/refund-dialog";
import { OrderTablePagination } from "./components/pagination";
import UserInfoModal from "@/page/staff/trip-management/components/user-info-modal";

export default function OrderManagementPage() {
  const controller = useOrderTable();

  const {
    orders,
    displayedOrders,
    users,
    depots,
    loading,
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    setPageSize,
    handleNextPage,
    handlePreviousPage,
    searchOrderCode,
    setSearchOrderCode,
    selectedUserId,
    setSelectedUserId,
    selectedDepotId,
    setSelectedDepotId,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    clearFilters,
    detailDialogOpen,
    setDetailDialogOpen,
    updateStatusDialogOpen,
    setUpdateStatusDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    refundDialogOpen,
    setRefundDialogOpen,
    userInfoUserId,
    setUserInfoUserId,
    selectedOrder,
    setSelectedOrder,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    refundedAmount,
    setRefundedAmount,
    adminRefundNote,
    setAdminRefundNote,
    submittingRefund,
    handleSearchOrderByCode,
    handleUpdateStatus,
    handleDelete,
    handleConfirmRefund,
    viewOrderDetails,
  } = controller;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn đặt xe</h1>
        <p className="text-muted-foreground">Quản lý đơn đặt xe để quản lý các đơn đặt xe trên hệ thống.</p>
      </div>

      {loading && (!orders || orders.length === 0) ? (
        <OrderTableLoadingState />
      ) : (
        <div className="space-y-4">
          <OrderTableToolbar
            searchOrderCode={searchOrderCode}
            onSearchOrderCodeChange={setSearchOrderCode}
            onSearch={handleSearchOrderByCode}
            pageSize={pageSize}
            onPageSizeChange={(size) => setPageSize(Number(size))}
            selectedUserId={selectedUserId}
            onSelectedUserIdChange={setSelectedUserId}
            selectedDepotId={selectedDepotId}
            onSelectedDepotIdChange={setSelectedDepotId}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            onPaymentStatusFilterChange={setPaymentStatusFilter}
            startDateFilter={startDateFilter}
            onStartDateFilterChange={setStartDateFilter}
            endDateFilter={endDateFilter}
            onEndDateFilterChange={setEndDateFilter}
            onClearFilters={clearFilters}
            users={users}
            depots={depots}
          />

          <OrderTable
            orders={displayedOrders}
            loading={loading}
            onViewDetails={viewOrderDetails}
            onUpdateStatus={(order) => {
              setSelectedOrder(order);
              setStatus(order.status);
              setPaymentStatus(order.paymentStatus);
              setUpdateStatusDialogOpen(true);
            }}
            onDelete={(order) => {
              setSelectedOrder(order);
              setDeleteDialogOpen(true);
            }}
            onRefund={(order) => {
              setSelectedOrder(order);
              setRefundedAmount(order.refundAmount || "0");
              setAdminRefundNote("");
              setRefundDialogOpen(true);
            }}
            onViewUser={setUserInfoUserId}
          />

          <OrderTablePagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            loading={loading}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />

          <OrderDetailDialog isOpen={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} order={selectedOrder} />

          <UpdateStatusDialog
            isOpen={updateStatusDialogOpen}
            onClose={() => setUpdateStatusDialogOpen(false)}
            status={status}
            paymentStatus={paymentStatus}
            onStatusChange={setStatus}
            onPaymentStatusChange={setPaymentStatus}
            onConfirm={handleUpdateStatus}
          />

          <DeleteDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            order={selectedOrder}
            onConfirm={handleDelete}
          />

          <RefundDialog
            isOpen={refundDialogOpen}
            onClose={() => {
              setRefundDialogOpen(false);
              setRefundedAmount("");
              setAdminRefundNote("");
            }}
            refundedAmount={refundedAmount}
            onRefundedAmountChange={setRefundedAmount}
            adminRefundNote={adminRefundNote}
            onAdminRefundNoteChange={setAdminRefundNote}
            submitting={submittingRefund}
            onConfirm={handleConfirmRefund}
          />

          <UserInfoModal
            open={!!userInfoUserId}
            onOpenChange={(open) => {
              if (!open) setUserInfoUserId(null);
            }}
            userId={userInfoUserId}
          />
        </div>
      )}
    </div>
  );
}
