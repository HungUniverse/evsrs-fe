import { useOrderTable } from "./hooks/use-order-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { OrderTableToolbar } from "./components/toolbar";
import { OrderTable } from "./components/table";
import { OrderTableLoadingState } from "./components/loading-state";
import { UpdateStatusDialog } from "./components/update-status-dialog";
// import { DeleteDialog } from "./components/delete-dialog"; // Commented out - delete function removed
import { RefundDialog } from "./components/refund-dialog";
import UserInfoModal from "@/page/staff/trip-management/components/user-info-modal";
import { OrderStats } from "./components/order-stats";
import { OrderStatsDetail } from "./components/order-stats-detail";
import { OrderStatusDistribution } from "./components/order-status-distribution";
import { OrderInsights } from "./components/order-insights";

export default function OrderManagementPage() {
  const controller = useOrderTable();

  const {
    orders,
    displayedOrders,
    users,
    depots,
    models,
    loading,
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    setPageSize,
    setPageNumber,
    handleNextPage,
    handlePreviousPage,
    searchOrderCode,
    setSearchOrderCode,
    selectedUserId,
    setSelectedUserId,
    selectedDepotId,
    setSelectedDepotId,
    selectedModelId,
    setSelectedModelId,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    clearFilters,
    updateStatusDialogOpen,
    setUpdateStatusDialogOpen,
    // deleteDialogOpen,
    // setDeleteDialogOpen,
    refundDialogOpen,
    setRefundDialogOpen,
    userInfoUserId,
    setUserInfoUserId,
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
    // handleDelete,
    handleConfirmRefund,
  } = controller;

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý đơn đặt xe</h1>
        <p className="text-muted-foreground">Quản lý đơn đặt xe để quản lý các đơn đặt xe trên hệ thống.</p>
      </div>

      {loading && (!orders || orders.length === 0) ? (
        <OrderTableLoadingState />
      ) : (
        <div className="space-y-4">
          <OrderStats orders={orders} loading={loading} />
          <OrderStatsDetail orders={orders} loading={loading} />
          
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <OrderStatusDistribution orders={orders} loading={loading} />
            <OrderInsights orders={orders} loading={loading} />
          </div>
          
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
            selectedModelId={selectedModelId}
            onSelectedModelIdChange={setSelectedModelId}
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
            models={models}
          />

          <OrderTable
            orders={displayedOrders}
            loading={loading}
            onUpdateStatus={(order) => {
              setSelectedOrder(order);
              setStatus(order.status);
              setPaymentStatus(order.paymentStatus);
              setUpdateStatusDialogOpen(true);
            }}
            onRefund={(order) => {
              setSelectedOrder(order);
              setRefundedAmount(order.refundAmount || "0");
              setAdminRefundNote("");
              setRefundDialogOpen(true);
            }}
            onViewUser={setUserInfoUserId}
          />

          <TablePagination
            currentPage={pageNumber}
            totalPages={totalPages}
            startItem={totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1}
            endItem={Math.min(pageNumber * pageSize, totalCount)}
            totalItems={totalCount}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onPageChange={setPageNumber}
            loading={loading}
          />

          <UpdateStatusDialog
            isOpen={updateStatusDialogOpen}
            onClose={() => setUpdateStatusDialogOpen(false)}
            status={status}
            paymentStatus={paymentStatus}
            onStatusChange={setStatus}
            onPaymentStatusChange={setPaymentStatus}
            onConfirm={handleUpdateStatus}
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
