import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { UserFullAPI } from "@/apis/user.api";
import { depotAPI } from "@/apis/depot.api";
import { modelAPI } from "@/apis/model-ev.api";

export interface UseOrderTableResult {
  // Data
  orders: OrderBookingDetail[];
  displayedOrders: OrderBookingDetail[];
  users: UserFull[];
  depots: Depot[];
  models: Model[];
  loading: boolean;

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
  searchOrderCode: string;
  setSearchOrderCode: (value: string) => void;
  selectedDepotId: string;
  setSelectedDepotId: (value: string) => void;
  selectedModelId: string;
  setSelectedModelId: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (value: string) => void;
  startDateFilter: string;
  setStartDateFilter: (value: string) => void;
  endDateFilter: string;
  setEndDateFilter: (value: string) => void;
  clearFilters: () => void;

  // Dialogs
  updateStatusDialogOpen: boolean;
  setUpdateStatusDialogOpen: (open: boolean) => void;
  userInfoUserId: string | null;
  setUserInfoUserId: (userId: string | null) => void;

  // Selected order
  selectedOrder: OrderBookingDetail | null;
  setSelectedOrder: (order: OrderBookingDetail | null) => void;

  // Form states
  status: OrderBookingStatus;
  setStatus: (status: OrderBookingStatus) => void;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (status: PaymentStatus) => void;
  // Actions
  fetchOrders: () => Promise<void>;
  handleSearchOrderByCode: () => Promise<void>;
  handleUpdateStatus: () => Promise<void>;
}

export function useOrderTable(): UseOrderTableResult {
  const [allOrders, setAllOrders] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderBookingDetail | null>(null);
  const [userInfoUserId, setUserInfoUserId] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderBookingStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [searchOrderCode, setSearchOrderCode] = useState<string>("");
  const [selectedDepotId, setSelectedDepotId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  const [users, setUsers] = useState<UserFull[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);
  const [models, setModels] = useState<Model[]>([]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const combinedOrders: OrderBookingDetail[] = [];
      let currentPage = 1;
      let shouldContinue = true;

      // Fetch all pages using only pageNumber and pageSize (no filters)
      while (shouldContinue) {
        const response = await orderBookingAPI.getAll({ 
          pageNumber: currentPage, 
          pageSize: 10 
        });
        const data = response.data?.data;
        const items = data?.items || [];
        combinedOrders.push(...items);

        const totalPagesFromApi = data?.totalPages ?? currentPage;
        const hasMoreByTotalPages = totalPagesFromApi > 0 ? currentPage < totalPagesFromApi : false;
        shouldContinue = data?.hasNextPage || hasMoreByTotalPages;

        if (items.length === 0) {
          shouldContinue = false;
        }

        currentPage += 1;
      }

      setAllOrders(combinedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn đặt xe");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await UserFullAPI.getAll(1, 100);
      const items = response?.data?.data?.items;
      if (!Array.isArray(items)) {
        setUsers([]);
        return;
      }
      const filteredUsers = items.filter((user) => user.role === "USER");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
      setUsers([]);
    }
  };

  const fetchDepots = async () => {
    try {
      const response = await depotAPI.getAll(1, 100);
      const items = response?.data?.data?.items;
      setDepots(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Error fetching depots:", error);
      toast.error("Không thể tải danh sách trạm xe điện");
      setDepots([]);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await modelAPI.getAll(1, 100);
      const items = response?.data?.data?.items;
      setModels(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Không thể tải danh sách model");
      setModels([]);
    }
  };

  const handleSearchOrderByCode = async () => {
    if (!searchOrderCode.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    // Reset to page 1, filtering is done on client side
    setPageNumber(1);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await orderBookingAPI.updateStatus(selectedOrder.id, status, paymentStatus);
      toast.success("Cập nhật trạng thái thành công");
      setUpdateStatusDialogOpen(false);
      await fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Filter orders on client side (API doesn't support filters)
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // Status filter
      const matchStatus =
        statusFilter === "all" || order.status === (statusFilter as OrderBookingStatus);
      
      // Payment status filter
      const matchPaymentStatus =
        paymentStatusFilter === "all" || order.paymentStatus === (paymentStatusFilter as PaymentStatus);
      
      // Depot filter
      const matchDepot = !selectedDepotId || order.depot?.id === selectedDepotId;
      
      // Model filter
      const matchModel = !selectedModelId || order.carEvs?.model?.id === selectedModelId;

      // Date filters
      let matchStartDate = true;
      let matchEndDate = true;
      if (startDateFilter) {
        const orderStart = new Date(order.startAt);
        const selectedStart = new Date(startDateFilter);
        selectedStart.setHours(0, 0, 0, 0);
        matchStartDate = orderStart >= selectedStart;
      }
      if (endDateFilter) {
        const orderEnd = new Date(order.endAt);
        const selectedEnd = new Date(endDateFilter);
        selectedEnd.setHours(23, 59, 59, 999);
        matchEndDate = orderEnd <= selectedEnd;
      }

      // Search filter (exact match on order code)
      const matchSearch = !searchOrderCode.trim() || order.code === searchOrderCode.trim();

      return matchStatus && matchPaymentStatus && matchDepot && matchModel && matchStartDate && matchEndDate && matchSearch;
    });
  }, [
    allOrders,
    statusFilter,
    paymentStatusFilter,
    selectedDepotId,
    selectedModelId,
    startDateFilter,
    endDateFilter,
    searchOrderCode,
  ]);

  // Calculate pagination from filtered orders
  const totalCount = filteredOrders.length;
  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);

  // Paginate filtered orders on client side
  const displayedOrders = useMemo(() => {
    if (totalCount === 0) {
      return [];
    }
    const safePageNumber = Math.min(pageNumber, totalPages);
    const startIndex = (safePageNumber - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, pageNumber, pageSize, totalCount, totalPages]);

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const clearFilters = () => {
    setSelectedDepotId("");
    setSelectedModelId("");
    setSearchOrderCode("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setPageNumber(1);
  };

  const hasNextPage = totalCount === 0 ? false : pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  useEffect(() => {
    fetchUsers();
    fetchDepots();
    fetchModels();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 when filters or pageSize change
  useEffect(() => {
    setPageNumber(1);
  }, [
    statusFilter,
    paymentStatusFilter,
    selectedDepotId,
    selectedModelId,
    startDateFilter,
    endDateFilter,
    searchOrderCode,
    pageSize,
  ]);

  // Clamp page number when totalPages changes
  useEffect(() => {
    if (pageNumber > totalPages && totalPages > 0) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  return {
    orders: allOrders,
    displayedOrders,
    users,
    depots,
    models,
    loading,
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
    selectedOrder,
    setSelectedOrder,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    fetchOrders,
    handleSearchOrderByCode,
    handleUpdateStatus,
  };
}

