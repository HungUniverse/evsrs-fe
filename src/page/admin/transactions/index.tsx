import { useTransactionTable } from "./hooks/use-transaction-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { TransactionTableToolbar } from "./components/toolbar";
import { TransactionTable } from "./components/table";
import { TransactionTableLoadingState } from "./components/loading-state";
import { TransactionDetailDialog } from "./components/detail-dialog";
import { OrderDetailDialog } from "./components/order-detail-dialog";
import UserInfoModal from "@/page/staff/trip-management/components/user-info-modal";

export default function Transactions() {
  const controller = useTransactionTable();

  const {
    displayedTransactions,
    loading,
    usersMap,
    ordersMap,
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    setPageSize,
    setPageNumber,
    handleNextPage,
    handlePreviousPage,
    searchCode,
    setSearchCode,
    userNameSearch,
    setUserNameSearch,
    transferTypeFilter,
    setTransferTypeFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    clearFilters,
    detailDialogOpen,
    setDetailDialogOpen,
    userInfoUserId,
    setUserInfoUserId,
    orderDetailOrderId,
    setOrderDetailOrderId,
    orderDetail,
    loadingOrderDetail,
    selectedTransaction,
    viewTransactionDetails,
    fetchOrderDetail,
  } = controller;

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý giao dịch</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi các giao dịch thanh toán trong hệ thống.</p>
      </div>

      {loading && displayedTransactions.length === 0 ? (
        <TransactionTableLoadingState />
      ) : (
        <div className="space-y-4">
          <TransactionTableToolbar
            searchCode={searchCode}
            onSearchCodeChange={setSearchCode}
            userNameSearch={userNameSearch}
            onUserNameSearchChange={setUserNameSearch}
            transferTypeFilter={transferTypeFilter}
            onTransferTypeFilterChange={setTransferTypeFilter}
            startDateFilter={startDateFilter}
            onStartDateFilterChange={setStartDateFilter}
            endDateFilter={endDateFilter}
            onEndDateFilterChange={setEndDateFilter}
            onClearFilters={clearFilters}
            pageSize={pageSize}
            onPageSizeChange={(size) => setPageSize(Number(size))}
          />

          <TransactionTable
            transactions={displayedTransactions}
            loading={loading}
            onViewDetails={viewTransactionDetails}
            onViewUser={setUserInfoUserId}
            onViewOrder={(orderId) => {
              if (orderId && orderId.trim()) {
                setOrderDetailOrderId(orderId);
              } else {
                console.error("Invalid orderId:", orderId);
              }
            }}
            usersMap={usersMap}
            ordersMap={ordersMap}
            startIndex={totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1}
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

          <TransactionDetailDialog
            isOpen={detailDialogOpen}
            onClose={() => {
              setDetailDialogOpen(false);
              // Don't reset orderDetailOrderId here - let OrderDetailDialog handle it
            }}
            transaction={selectedTransaction}
            orderDetail={orderDetail}
            usersMap={usersMap}
            ordersMap={ordersMap}
            onViewUser={(userId) => {
              setUserInfoUserId(userId);
              setDetailDialogOpen(false);
            }}
            onViewOrder={(orderId) => {
              // Validate orderId before opening dialog
              if (orderId && orderId.trim()) {
                // Set orderDetailOrderId first, then close transaction dialog
                // OrderDetailDialog will automatically fetch via useEffect when it opens
                setOrderDetailOrderId(orderId);
                setDetailDialogOpen(false);
              } else {
                console.error("Invalid orderId:", orderId);
              }
            }}
          />

          <OrderDetailDialog
            isOpen={!!orderDetailOrderId}
            onClose={() => {
              setOrderDetailOrderId(null);
              // orderDetail will be cleared when a new order is fetched or when component unmounts
            }}
            order={orderDetail}
            loading={loadingOrderDetail}
            orderId={orderDetailOrderId || ""}
            onFetchOrder={fetchOrderDetail}
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
