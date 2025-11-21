import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import type { TransactionResponse } from "@/@types/payment/transaction";
import { TransactionApi } from "@/apis/transaction.api";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { UserFullAPI } from "@/apis/user.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { UserFull } from "@/@types/auth.type";

export interface UseTransactionTableResult {
  // Data
  transactions: TransactionResponse[];
  displayedTransactions: TransactionResponse[];
  loading: boolean;
  usersMap: Map<string, UserFull>;
  ordersMap: Map<string, OrderBookingDetail>;

  // Pagination
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPageNumber: (page: number) => void;
  setPageSize: (size: number) => void;
  handleNextPage: () => void;
  handlePreviousPage: () => void;

  // Filters
  searchCode: string;
  setSearchCode: (value: string) => void;
  userNameSearch: string;
  setUserNameSearch: (value: string) => void;
  transferTypeFilter: string;
  setTransferTypeFilter: (value: string) => void;
  startDateFilter: string;
  setStartDateFilter: (value: string) => void;
  endDateFilter: string;
  setEndDateFilter: (value: string) => void;
  clearFilters: () => void;

  // Dialogs
  detailDialogOpen: boolean;
  setDetailDialogOpen: (open: boolean) => void;
  userInfoUserId: string | null;
  setUserInfoUserId: (userId: string | null) => void;
  orderDetailOrderId: string | null;
  setOrderDetailOrderId: (orderId: string | null) => void;
  orderDetail: OrderBookingDetail | null;
  loadingOrderDetail: boolean;

  // Selected transaction
  selectedTransaction: TransactionResponse | null;
  setSelectedTransaction: (transaction: TransactionResponse | null) => void;

  // Actions
  fetchTransactions: () => Promise<void>;
  viewTransactionDetails: (transaction: TransactionResponse) => void;
  fetchOrderDetail: (orderId: string) => Promise<void>;
}

export function useTransactionTable(): UseTransactionTableResult {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [usersMap, setUsersMap] = useState<Map<string, UserFull>>(new Map());
  const [ordersMap, setOrdersMap] = useState<Map<string, OrderBookingDetail>>(new Map());

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
  const [userInfoUserId, setUserInfoUserId] = useState<string | null>(null);
  const [orderDetailOrderId, setOrderDetailOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderBookingDetail | null>(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  const [searchCode, setSearchCode] = useState<string>("");
  const [userNameSearch, setUserNameSearch] = useState<string>("");
  const [transferTypeFilter, setTransferTypeFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [apiPageNumber, setApiPageNumber] = useState<number | null>(null);

  // Helper: Convert UI page number to API page number (inverted)
  // UI page 1 = API page totalPages (newest)
  // UI page 2 = API page totalPages - 1
  // UI page N = API page totalPages - (N - 1)
  const uiPageToApiPage = useCallback((uiPage: number, totalPages: number): number => {
    if (totalPages === 0) return 1;
    return totalPages - (uiPage - 1);
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Determine API page number to fetch
      // On initial mount, fetch totalPages (newest data)
      // Otherwise, use the calculated API page from UI page
      let currentApiPage: number;
      if (isInitialMount && totalPages === 0) {
        // First fetch: get page 1 to determine totalPages
        currentApiPage = 1;
      } else if (isInitialMount && totalPages > 0) {
        // Initial mount after getting totalPages: fetch newest page
        currentApiPage = totalPages;
        setApiPageNumber(totalPages);
      } else {
        // Normal navigation: convert UI page to API page
        currentApiPage = uiPageToApiPage(pageNumber, totalPages || 1);
        setApiPageNumber(currentApiPage);
      }
      
      const response = await TransactionApi.getAll({
        page: currentApiPage,
        pageSize: pageSize,
      });
      
      const responseData = response.data;
      const items = responseData?.items || [];

      // Update pagination metadata from API response
      if (responseData) {
        const newTotalPages = responseData.totalPages || 0;
        setTotalPages(newTotalPages);
        setTotalCount(responseData.totalCount || 0);
        
        // Use the actual API page number that was fetched
        const actualApiPage = apiPageNumber !== null ? apiPageNumber : currentApiPage;
        
        // For inverted pagination:
        // - UI page 1 = API page totalPages (newest)
        // - hasNextPage means we can go to UI page + 1 (older data) = API page - 1
        // - hasPreviousPage means we can go to UI page - 1 (newer data) = API page + 1
        // Check if there are older pages (lower API page numbers)
        setHasNextPage(actualApiPage > 1);
        // Check if there are newer pages (higher API page numbers)
        setHasPreviousPage(actualApiPage < newTotalPages);
        
        // On initial mount after getting totalPages, set UI page to 1
        if (isInitialMount && newTotalPages > 0 && pageNumber !== 1) {
          setIsInitialMount(false);
          // UI page 1 represents the newest data (API page totalPages)
          setPageNumber(1);
        }
      }

      setTransactions(items);

      // Fetch users and orders for display
      const userIds = new Set<string>();
      const orderIds = new Set<string>();
      
      items.forEach((t) => {
        if (t.userId) userIds.add(t.userId);
        if (t.orderBookingId) orderIds.add(t.orderBookingId);
      });

      // Fetch users
      const usersPromises = Array.from(userIds).map(async (userId) => {
        try {
          const user = await UserFullAPI.getById(userId);
          return { userId, user };
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
          return null;
        }
      });

      // Fetch orders
      const ordersPromises = Array.from(orderIds).map(async (orderId) => {
        try {
          const response = await orderBookingAPI.getById(orderId);
          return { orderId, order: response.data.data };
        } catch (error) {
          console.error(`Error fetching order ${orderId}:`, error);
          return null;
        }
      });

      const [usersResults, ordersResults] = await Promise.all([
        Promise.all(usersPromises),
        Promise.all(ordersPromises),
      ]);

      // Build maps
      const newUsersMap = new Map<string, UserFull>();
      usersResults.forEach((result) => {
        if (result) {
          newUsersMap.set(result.userId, result.user);
        }
      });

      const newOrdersMap = new Map<string, OrderBookingDetail>();
      ordersResults.forEach((result) => {
        if (result) {
          newOrdersMap.set(result.orderId, result.order);
        }
      });

      setUsersMap(newUsersMap);
      setOrdersMap(newOrdersMap);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Không thể tải danh sách giao dịch");
      setTransactions([]);
      setTotalPages(0);
      setTotalCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, totalPages, isInitialMount, uiPageToApiPage, apiPageNumber]);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      setLoadingOrderDetail(true);
      const response = await orderBookingAPI.getById(orderId);
      setOrderDetail(response.data.data);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Không thể tải thông tin đơn hàng");
      setOrderDetail(null);
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  const viewTransactionDetails = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction);
    setDetailDialogOpen(true);
    // Don't automatically fetch order detail - only fetch when user clicks "Xem chi tiết" button
    setOrderDetailOrderId(null);
    setOrderDetail(null);
  };

  const handleNextPage = () => {
    if (hasNextPage && pageNumber < totalPages) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && pageNumber > 1) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
    }
  };

  const clearFilters = () => {
    setUserNameSearch("");
    setSearchCode("");
    setStartDateFilter("");
    setEndDateFilter("");
    setTransferTypeFilter("all");
    setPageNumber(1);
  };

  // Apply client-side filtering on the current page's transactions
  const displayedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by code
    if (searchCode.trim()) {
      filtered = filtered.filter((t) =>
        t.code?.toLowerCase().includes(searchCode.toLowerCase()) ||
        t.referenceCode?.toLowerCase().includes(searchCode.toLowerCase())
      );
    }

    // Filter by user name (fullName or userName)
    if (userNameSearch.trim()) {
      const searchTerm = userNameSearch.trim().toLowerCase();
      filtered = filtered.filter((t) => {
        if (!t.userId) return false;
        const user = usersMap.get(t.userId);
        if (!user) return false;
        const fullName = (user.fullName || "").toLowerCase();
        const userName = (user.userName || "").toLowerCase();
        return fullName.includes(searchTerm) || userName.includes(searchTerm);
      });
    }

    // Filter by transfer type
    if (transferTypeFilter !== "all") {
      filtered = filtered.filter((t) => t.transferType === transferTypeFilter);
    }

    // Filter by date range
    if (startDateFilter) {
      const startDate = new Date(startDateFilter);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) >= startDate
      );
    }

    if (endDateFilter) {
      const endDate = new Date(endDateFilter);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) <= endDate
      );
    }

    return filtered;
  }, [transactions, searchCode, userNameSearch, transferTypeFilter, startDateFilter, endDateFilter, usersMap]);

  // Fetch transactions when pageNumber or pageSize changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 (newest data) when filters change
  useEffect(() => {
    setPageNumber(1);
    setApiPageNumber(null);
    // Don't reset isInitialMount here - we only want auto-navigate on true initial mount
  }, [searchCode, userNameSearch, transferTypeFilter, startDateFilter, endDateFilter]);

  return {
    transactions,
    displayedTransactions,
    loading,
    usersMap,
    ordersMap,
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    setPageNumber,
    setPageSize,
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
    setSelectedTransaction,
    fetchTransactions,
    viewTransactionDetails,
    fetchOrderDetail,
  };
}

