import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { OrderTableApi } from "../api/order-table.api";

export interface UseOrderTableResult {
  // Data
  orders: OrderBookingDetail[];
  displayedOrders: OrderBookingDetail[];
  users: UserFull[];
  depots: Depot[];
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
  detailDialogOpen: boolean;
  setDetailDialogOpen: (open: boolean) => void;
  updateStatusDialogOpen: boolean;
  setUpdateStatusDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  refundDialogOpen: boolean;
  setRefundDialogOpen: (open: boolean) => void;
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
  refundedAmount: string;
  setRefundedAmount: (amount: string) => void;
  adminRefundNote: string;
  setAdminRefundNote: (note: string) => void;
  submittingRefund: boolean;

  // Actions
  fetchOrders: () => Promise<void>;
  handleSearchOrderByCode: () => Promise<void>;
  handleUpdateStatus: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleConfirmRefund: () => Promise<void>;
  viewOrderDetails: (order: OrderBookingDetail) => void;
}

export function useOrderTable(): UseOrderTableResult {
  const [orders, setOrders] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderBookingDetail | null>(null);
  const [userInfoUserId, setUserInfoUserId] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderBookingStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchOrderCode, setSearchOrderCode] = useState<string>("");
  const [selectedDepotId, setSelectedDepotId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  const [refundedAmount, setRefundedAmount] = useState<string>("");
  const [adminRefundNote, setAdminRefundNote] = useState<string>("");
  const [submittingRefund, setSubmittingRefund] = useState(false);

  const [users, setUsers] = useState<UserFull[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const isRefundPending = statusFilter === "REFUND_PENDING";
      const result = isRefundPending
        ? await OrderTableApi.fetchRefundPendingOrders({ pageNumber, pageSize })
        : await OrderTableApi.fetchOrders({ pageNumber, pageSize });

      setOrders(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setHasNextPage(result.hasNextPage);
      setHasPreviousPage(result.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn đặt xe");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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
        setTotalPages(1);
        setTotalCount(1);
        setHasNextPage(false);
        setHasPreviousPage(false);
        toast.success("Tìm thấy đơn đặt xe");
      } else {
        setOrders([]);
        setTotalPages(0);
        setTotalCount(0);
        setHasNextPage(false);
        setHasPreviousPage(false);
        toast.info("Không tìm thấy đơn đặt xe với mã này");
      }
    } catch (error) {
      console.error("Error searching order by code:", error);
      toast.error("Không tìm thấy đơn đặt xe với mã này");
      setOrders([]);
      setTotalPages(0);
      setTotalCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
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

  const handleDelete = async () => {
    if (!selectedOrder) return;

    if (selectedOrder.status !== "PENDING" && selectedOrder.status !== "CANCELLED") {
      toast.error("Chỉ có thể xóa đơn đặt xe ở trạng thái 'Chờ xác nhận' hoặc 'Đã hủy'");
      setDeleteDialogOpen(false);
      return;
    }

    try {
      await OrderTableApi.deleteOrder(selectedOrder.id);
      toast.success("Xóa đơn đặt xe thành công");
      setDeleteDialogOpen(false);
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Không thể xóa đơn đặt xe");
    }
  };

  const handleConfirmRefund = async () => {
    if (!selectedOrder) return;
    const amountNumber = Number(refundedAmount);
    if (Number.isNaN(amountNumber) || amountNumber < 0) {
      toast.error("Vui lòng nhập số tiền hoàn hợp lệ");
      return;
    }
    try {
      setSubmittingRefund(true);
      await OrderTableApi.refundOrder(selectedOrder.id, amountNumber, adminRefundNote || "");
      toast.success("Xác nhận hoàn tiền thành công");
      setRefundDialogOpen(false);
      setRefundedAmount("");
      setAdminRefundNote("");
      await fetchOrders();
    } catch (error) {
      console.error("Error confirming refund:", error);
      toast.error("Không thể xác nhận hoàn tiền");
    } finally {
      setSubmittingRefund(false);
    }
  };

  const viewOrderDetails = (order: OrderBookingDetail) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
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
    setSelectedUserId("");
    setSelectedDepotId("");
    setSearchOrderCode("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setPageNumber(1);
    fetchOrders();
  };

  const displayedOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.status === (statusFilter as OrderBookingStatus);
      const matchPaymentStatus =
        paymentStatusFilter === "all" || order.paymentStatus === (paymentStatusFilter as PaymentStatus);
      const matchUser = !selectedUserId || order.user?.id === selectedUserId;
      const matchDepot = !selectedDepotId || order.depot?.id === selectedDepotId;

      let matchStartDate = true;
      let matchEndDate = true;

      if (startDateFilter && !endDateFilter) {
        const orderStart = new Date(order.startAt);
        const startOnly = new Date(orderStart);
        startOnly.setHours(0, 0, 0, 0);
        const selectedStart = new Date(startDateFilter);
        selectedStart.setHours(0, 0, 0, 0);
        matchStartDate = startOnly.getTime() === selectedStart.getTime();
      } else if (endDateFilter && !startDateFilter) {
        const orderEnd = new Date(order.endAt);
        const endOnly = new Date(orderEnd);
        endOnly.setHours(0, 0, 0, 0);
        const selectedEnd = new Date(endDateFilter);
        selectedEnd.setHours(0, 0, 0, 0);
        matchEndDate = endOnly.getTime() === selectedEnd.getTime();
      } else {
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
      }

      return matchStatus && matchPaymentStatus && matchUser && matchDepot && matchStartDate && matchEndDate;
    });
  }, [orders, statusFilter, paymentStatusFilter, selectedUserId, selectedDepotId, startDateFilter, endDateFilter]);

  useEffect(() => {
    fetchUsers();
    fetchDepots();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const isRefundPending = statusFilter === "REFUND_PENDING";
        const result = isRefundPending
          ? await OrderTableApi.fetchRefundPendingOrders({ pageNumber, pageSize })
          : await OrderTableApi.fetchOrders({ pageNumber, pageSize });

        setOrders(result.items);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setHasNextPage(result.hasNextPage);
        setHasPreviousPage(result.hasPreviousPage);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải danh sách đơn đặt xe");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [statusFilter, pageNumber, pageSize]);

  // Reset to page 1 when status filter changes (but not on initial mount)
  useEffect(() => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  return {
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
    fetchOrders,
    handleSearchOrderByCode,
    handleUpdateStatus,
    handleDelete,
    handleConfirmRefund,
    viewOrderDetails,
  };
}

