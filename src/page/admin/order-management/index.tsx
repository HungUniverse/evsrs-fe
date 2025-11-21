import { useOrderTable } from "./hooks/use-order-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { OrderTableToolbar } from "./components/toolbar";
import { OrderTable } from "./components/table";
import { OrderTableLoadingState } from "./components/loading-state";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import UserInfoModal from "@/page/staff/trip-management/components/user-info-modal";
import { OrderStats } from "./components/order-stats";


export default function OrderManagementPage() {
  const controller = useOrderTable();

  const {
    orders,
    displayedOrders,
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
    userInfoUserId,
    setUserInfoUserId,
    setSelectedOrder,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    handleSearchOrderByCode,
    handleUpdateStatus,
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
          <OrderStats />
          
          <OrderTableToolbar
            searchOrderCode={searchOrderCode}
            onSearchOrderCodeChange={setSearchOrderCode}
            onSearch={handleSearchOrderByCode}
            pageSize={pageSize}
            onPageSizeChange={(size) => setPageSize(Number(size))}
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
            depots={depots}
            models={models}
          />

          <OrderTable
            orders={displayedOrders}
            loading={loading}
            startIndex={totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1}
            onUpdateStatus={(order) => {
              setSelectedOrder(order);
              setStatus(order.status);
              setPaymentStatus(order.paymentStatus);
              setUpdateStatusDialogOpen(true);
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
