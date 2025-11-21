import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import type { Model } from "@/@types/car/model";
import { OrderTableApi } from "../api/order-table.api";

const FETCH_PAGE_SIZE = 200;

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
  selectedUserId: string;
  setSelectedUserId: (value: string) => void;
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
  const [orders, setOrders] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderBookingDetail | null>(null);
  const [userInfoUserId, setUserInfoUserId] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderBookingStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
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

      while (shouldContinue) {
        const result = await OrderTableApi.fetchOrders({ pageNumber: currentPage, pageSize: FETCH_PAGE_SIZE });
        const items = result.items || [];
        combinedOrders.push(...items);

        const totalPagesFromApi = result.totalPages ?? currentPage;
        const hasMoreByTotalPages = totalPagesFromApi > 0 ? currentPage < totalPagesFromApi : false;
        shouldContinue = result.hasNextPage || hasMoreByTotalPages;

        if (items.length === 0) {
          shouldContinue = false;
        }

        currentPage += 1;
      }

      setOrders(combinedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn đặt xe");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const userList = await OrderTableApi.fetchUsers();
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  const fetchDepots = async () => {
    try {
      const depotList = await OrderTableApi.fetchDepots();
      setDepots(depotList);
    } catch (error) {
      console.error("Error fetching depots:", error);
      toast.error("Không thể tải danh sách trạm xe điện");
    }
  };

  const fetchModels = async () => {
    try {
      const modelList = await OrderTableApi.fetchModels();
      setModels(modelList);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Không thể tải danh sách model");
    }
  };

  const handleSearchOrderByCode = async () => {
    if (!searchOrderCode.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }
    try {
      setLoading(true);
      const trimmedCode = searchOrderCode.trim();
      const result = await OrderTableApi.fetchOrdersByCode(trimmedCode, { pageNumber: 1, pageSize: 100 });
      
      // Filter để chỉ lấy đơn hàng có code chính xác (exact match)
      // Vì code là unique nên chỉ nên có tối đa 1 đơn hàng
      const exactMatchOrders = result?.items?.filter((order) => order.code === trimmedCode) || [];
      
      if (exactMatchOrders.length > 0) {
        setOrders(exactMatchOrders);
        setPageNumber(1);
        toast.success("Tìm thấy đơn đặt xe");
      } else {
        setOrders([]);
        setPageNumber(1);
        toast.info("Không tìm thấy đơn đặt xe với mã này");
      }
    } catch (error) {
      console.error("Error searching order by code:", error);
      toast.error("Không tìm thấy đơn đặt xe với mã này");
      setOrders([]);
      setPageNumber(1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await OrderTableApi.updateOrderStatus(selectedOrder.id, status, paymentStatus);
      toast.success("Cập nhật trạng thái thành công");
      setUpdateStatusDialogOpen(false);
      await fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const clearFilters = () => {
    setSelectedUserId("");
    setSelectedDepotId("");
    setSelectedModelId("");
    setSearchOrderCode("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setPageNumber(1);
    fetchOrders();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" || order.status === (statusFilter as OrderBookingStatus);
      const matchPaymentStatus =
        paymentStatusFilter === "all" || order.paymentStatus === (paymentStatusFilter as PaymentStatus);
      const matchUser = !selectedUserId || order.user?.id === selectedUserId;
      const matchDepot = !selectedDepotId || order.depot?.id === selectedDepotId;
      const matchModel = !selectedModelId || order.carEvs?.model?.id === selectedModelId;

      let matchStartDate = true;
      let matchEndDate = true;

      // Sử dụng range match cho tất cả trường hợp để nhất quán và hợp lý hơn
      // - Start Date: lấy đơn có startAt >= ngày bắt đầu (từ ngày này trở đi)
      // - End Date: lấy đơn có endAt <= ngày kết thúc (đến ngày này trở về)
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

      return matchStatus && matchPaymentStatus && matchUser && matchDepot && matchModel && matchStartDate && matchEndDate;
    });
  }, [
    orders,
    statusFilter,
    paymentStatusFilter,
    selectedUserId,
    selectedDepotId,
    selectedModelId,
    startDateFilter,
    endDateFilter,
  ]);

  const totalCount = filteredOrders.length;
  const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);

  const displayedOrders = useMemo(() => {
    if (totalCount === 0) {
      return [];
    }
    const safePageNumber = Math.min(pageNumber, totalPages);
    const startIndex = (safePageNumber - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, pageNumber, pageSize, totalCount, totalPages]);

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

  // Reset to page 1 when filters or pageSize change (but not on initial mount)
  useEffect(() => {
    setPageNumber(1);
  }, [
    statusFilter,
    paymentStatusFilter,
    selectedUserId,
    selectedDepotId,
    selectedModelId,
    startDateFilter,
    endDateFilter,
    pageSize,
  ]);

  // Clamp page number when filtered data shrinks
  useEffect(() => {
    if (pageNumber > totalPages) {
      setPageNumber(totalPages);
    }
  }, [pageNumber, totalPages]);

  return {
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
    hasNextPage,
    hasPreviousPage,
    setPageNumber,
    setPageSize,
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

