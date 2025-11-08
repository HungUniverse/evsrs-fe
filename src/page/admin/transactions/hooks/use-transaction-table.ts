import { useEffect, useMemo, useState } from "react";
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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await TransactionApi.getAll();
      const items = response.data?.items || [];
      
      // Sort by transaction date descending (newest first)
      const sortedItems = items.sort((a, b) => {
        const dateA = new Date(a.transactionDate).getTime();
        const dateB = new Date(b.transactionDate).getTime();
        return dateB - dateA;
      });

      setTransactions(sortedItems);

      // Fetch users and orders for display
      const userIds = new Set<string>();
      const orderIds = new Set<string>();
      
      sortedItems.forEach((t) => {
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
    } finally {
      setLoading(false);
    }
  };

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
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
  };

  const handlePreviousPage = () => {
    const prevPage = pageNumber - 1;
    setPageNumber(prevPage);
  };

  const clearFilters = () => {
    setUserNameSearch("");
    setSearchCode("");
    setStartDateFilter("");
    setEndDateFilter("");
    setTransferTypeFilter("all");
    setPageNumber(1);
  };

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

  // Calculate pagination
  const totalCount = displayedTransactions.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return displayedTransactions.slice(startIndex, endIndex);
  }, [displayedTransactions, pageNumber, pageSize]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [searchCode, userNameSearch, transferTypeFilter, startDateFilter, endDateFilter]);

  return {
    transactions,
    displayedTransactions: paginatedTransactions,
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

