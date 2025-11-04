import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit2,
  Trash2,
  Eye,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  ListChecks,
  CircleDollarSign,
  RotateCcw,
} from "lucide-react";
import { orderBookingAPI, type OrderBookingQuery } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus, PaymentStatus, PaymentMethod, PaymentType } from "@/@types/enum";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import { UserFullAPI } from "@/apis/user.api";
import type { UserFull } from "@/@types/auth.type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { depotAPI } from "@/apis/depot.api";
import type { Depot } from "@/@types/car/depot";
import UserInfoModal from "@/page/staff/trip-management/components/user-info-modal";

type OrderBookingQueryParams = {
  pageNumber?: number;
  pageSize?: number;
};

const statusOptions: { value: OrderBookingStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "READY_FOR_CHECKOUT", label: "Có thể nhận xe" },
  { value: "CHECKED_OUT", label: "Đã nhận xe" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "RETURNED", label: "Đã trả xe" },
  { value: "COMPLETED", label: "Hoàn tất" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "REFUND_PENDING", label: "Chờ hoàn tiền" },
];

const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID_DEPOSIT", label: "Đã trả cọc" },
  { value: "PAID_DEPOSIT_COMPLETED", label: "Đã trả đủ tiền nhận xe" },
  { value: "PAID_FULL", label: "Đã thanh toán đầy đủ" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
  { value: "FAILED", label: "Thất bại" },
];

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "BANKING", label: "Chuyển khoản ngân hàng" },
  { value: "CASH", label: "Tiền mặt" },
];

const paymentTypeOptions: { value: PaymentType; label: string }[] = [
  { value: "DEPOSIT", label: "Đặt cọc" },
  { value: "FULL", label: "Thanh toán đầy đủ" },
];

export default function OrderTable() {
  const [orders, setOrders] = useState<OrderBookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Modals state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderBookingDetail | null>(null);

  // Form states
  const [status, setStatus] = useState<OrderBookingStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userInfoUserId, setUserInfoUserId] = useState<string | null>(null);
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [selectedDepotId, setSelectedDepotId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  
  // Refund dialog state
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundedAmount, setRefundedAmount] = useState<string>("");
  const [adminRefundNote, setAdminRefundNote] = useState<string>("");
  const [submittingRefund, setSubmittingRefund] = useState(false);
  
  // User list and depot list for selection
  const [users, setUsers] = useState<UserFull[]>([]);
  const [depots, setDepots] = useState<Depot[]>([]);

  // Fetch orders with pagination
  const fetchOrders = async (query: OrderBookingQueryParams = {}) => {
    try {
      setLoading(true);
      const params: OrderBookingQuery = {
        pageNumber: query.pageNumber ?? pageNumber,
        pageSize: query.pageSize ?? pageSize,
      };

      // Use refund-pending API when filtering by REFUND_PENDING
      const isRefundPending = statusFilter === "REFUND_PENDING";
      const response = isRefundPending
        ? await orderBookingAPI.getRefundPending(params)
        : await orderBookingAPI.getAll(params);

      if (response.data?.data) {
        setOrders(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        setTotalCount(response.data.data.totalCount);
        setHasNextPage(response.data.data.hasNextPage);
        setHasPreviousPage(response.data.data.hasPreviousPage);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn đặt xe");
    } finally {
      setLoading(false);
    }
  };

  // View order details
  const viewOrderDetails = async (order: OrderBookingDetail) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  // Fetch users for selection
  const fetchUsers = async () => {
    try {
      const response = await UserFullAPI.getAll(1, 100); // Get first 100 users
      if (response.data?.data) {
        // Only show users with role = "USER"
        const userRoleUsers = response.data.data.items.filter(user => user.role === "USER");
        setUsers(userRoleUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  // Fetch depots for selection
  const fetchDepots = async () => {
    try {
      const response = await depotAPI.getAll(1, 100); // Get first 100 depots
      if (response.data?.data) {
        setDepots(response.data.data.items);
      }
    } catch (error) {
      console.error("Error fetching depots:", error);
      toast.error("Không thể tải danh sách trạm xe điện");
    }
  };

  // Search order by ID
  const handleSearchOrderById = async () => {
    if (!searchOrderId.trim()) {
      toast.error("Vui lòng nhập mã đơn đặt xe");
      return;
    }
    try {
      setLoading(true);
      const response = await orderBookingAPI.getById(searchOrderId);
      
      if (response.data?.data) {
        setOrders([response.data.data]);
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
      console.error("Error searching order:", error);
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

  // Update status
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await orderBookingAPI.updateStatus(selectedOrder.id, status, paymentStatus);
      toast.success("Cập nhật trạng thái thành công");
      setUpdateStatusDialogOpen(false);
      fetchOrders({ pageNumber, pageSize });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Confirm refund
  const handleConfirmRefund = async () => {
    if (!selectedOrder) return;
    const amountNumber = Number(refundedAmount);
    if (Number.isNaN(amountNumber) || amountNumber < 0) {
      toast.error("Vui lòng nhập số tiền hoàn hợp lệ");
      return;
    }
    try {
      setSubmittingRefund(true);
      await orderBookingAPI.refundOrderBooking(selectedOrder.id, {
        refundedAmount: amountNumber,
        adminNote: adminRefundNote || "",
      });
      toast.success("Xác nhận hoàn tiền thành công");
      setRefundDialogOpen(false);
      setRefundedAmount("");
      setAdminRefundNote("");
      fetchOrders({ pageNumber, pageSize });
    } catch (error) {
      console.error("Error confirming refund:", error);
      toast.error("Không thể xác nhận hoàn tiền");
    } finally {
      setSubmittingRefund(false);
    }
  };

  // Delete order
  const handleDelete = async () => {
    if (!selectedOrder) return;

    // Check if order can be deleted (only PENDING or CANCELLED)
    if (selectedOrder.status !== "PENDING" && selectedOrder.status !== "CANCELLED") {
      toast.error("Chỉ có thể xóa đơn đặt xe ở trạng thái 'Chờ xác nhận' hoặc 'Đã hủy'");
      setDeleteDialogOpen(false);
      return;
    }

    try {
      await orderBookingAPI.delete(selectedOrder.id);
      toast.success("Xóa đơn đặt xe thành công");
      setDeleteDialogOpen(false);
      fetchOrders({ pageNumber, pageSize });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Không thể xóa đơn đặt xe");
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    fetchOrders({ pageNumber: nextPage, pageSize });
  };

  const handlePreviousPage = () => {
    const prevPage = pageNumber - 1;
    setPageNumber(prevPage);
    fetchOrders({ pageNumber: prevPage, pageSize });
  };

  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    setPageSize(size);
    setPageNumber(1);
    fetchOrders({ pageNumber: 1, pageSize: size });
  };

  // Initialize
  useEffect(() => {
    fetchOrders({ pageNumber, pageSize });
    fetchUsers();
    fetchDepots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when status filter toggles refund mode
  useEffect(() => {
    setPageNumber(1);
    fetchOrders({ pageNumber: 1, pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Client-side filtered dataset
  const displayedOrders = orders.filter((order) => {
    const matchStatus = statusFilter === "all" || order.status === (statusFilter as OrderBookingStatus);
    const matchPaymentStatus =
      paymentStatusFilter === "all" || order.paymentStatus === (paymentStatusFilter as PaymentStatus);
    const matchUser = !selectedUserId || order.user?.id === selectedUserId;
    const matchDepot = !selectedDepotId || order.depot?.id === selectedDepotId;
    // Date filters (client-side)
    let matchStartDate = true;
    let matchEndDate = true;
    // If only start date is provided, match orders that START exactly on that calendar day
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

  // Status badge variants (using shadcn Badge variants)
  const getStatusVariant = (status: OrderBookingStatus) => {
    switch (status) {
      case "PENDING":
        return "soft-yellow" as const;
      case "CONFIRMED":
        return "soft-blue" as const;
      case "READY_FOR_CHECKOUT":
        return "soft-purple" as const;
      case "CHECKED_OUT":
        return "soft-indigo" as const;
      case "IN_USE":
        return "soft-green" as const;
      case "RETURNED":
        return "soft-orange" as const;
      case "COMPLETED":
        return "soft-green" as const;
      case "CANCELLED":
        return "soft-red" as const;
      default:
        return "soft-gray" as const;
    }
  };

  const getPaymentStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "soft-yellow" as const;
      case "PAID_DEPOSIT":
      case "PAID_DEPOSIT_COMPLETED":
        return "soft-blue" as const;
      case "PAID_FULL":
      case "COMPLETED":
        return "soft-green" as const;
      case "REFUNDED":
        return "soft-orange" as const;
      case "FAILED":
        return "soft-red" as const;
      default:
        return "soft-gray" as const;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* First row: Search bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mã đơn đặt xe..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchOrderById();
                }
              }}
              className="flex-1 max-w-md"
            />
            <Button
              onClick={handleSearchOrderById}
              size="sm"
              variant="outline"
              disabled={!searchOrderId.trim()}
            >
              Tìm kiếm
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Label>Số dòng mỗi trang:</Label>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second row: Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
          {/* Client-side filter: Start Date */}
          <div className="flex items-center gap-2">
            <Label>Ngày bắt đầu từ</Label>
            <Input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-[180px]"
            />
          </div>

          {/* Client-side filter: End Date */}
          <div className="flex items-center gap-2">
            <Label>Ngày kết thúc đến</Label>
            <Input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="w-[180px]"
            />
          </div>

          {/* Client-side filter: User */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <Select value={selectedUserId || "all"} onValueChange={(value) => setSelectedUserId(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Lọc theo khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khách hàng</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName || user.userName} - {user.userEmail}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client-side filter: Depot */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <Select value={selectedDepotId || "all"} onValueChange={(value) => setSelectedDepotId(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Lọc theo trạm xe điện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạm xe điện</SelectItem>
                {depots.map((depot) => (
                  <SelectItem key={depot.id} value={depot.id}>
                    {depot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client-side filter: Status */}
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client-side filter: Payment Status */}
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-gray-400" />
            <Select value={paymentStatusFilter} onValueChange={(v) => setPaymentStatusFilter(v)}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Lọc theo thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tình trạng thanh toán</SelectItem>
                {paymentStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              setSelectedUserId("");
              setSelectedDepotId("");
              setSearchOrderId("");
              setStartDateFilter("");
              setEndDateFilter("");
              setStatusFilter("all");
              setPaymentStatusFilter("all");
              setPageNumber(1);
              fetchOrders({ pageNumber: 1, pageSize });
            }}
            size="sm"
            variant="outline"
            className="sm:ml-auto group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50"
          >
            <RotateCcw className="h-3 w-3 mr-2 transition-transform duration-300 group-hover:rotate-180" />
            Đặt lại bộ lọc
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Ảnh xe</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Người thuê</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tình trạng thanh toán</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              displayedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-green-600">{order.code ? order.code.slice(0, 8) + "..." : "N/A"}</TableCell>
                  <TableCell>
                    {order.carEvs?.model?.image ? (
                      <img
                        src={order.carEvs.model.image}
                        alt={order.carEvs.model.modelName}
                        className="h-10 w-16 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.carEvs?.model?.modelName || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <button
                        type="button"
                        className="font-medium text-blue-600 hover:underline"
                        onClick={() => {
                          if (order.user?.id) setUserInfoUserId(order.user.id);
                        }}
                      >
                        {order.user?.fullName || order.user?.userName || "N/A"}
                      </button>
                      <div className="text-sm text-gray-500">{order.user?.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.startAt)}</TableCell>
                  <TableCell>{formatDate(order.endAt)}</TableCell>
                  <TableCell>{vnd(parseFloat(order.totalAmount))} VNĐ</TableCell>
                  <TableCell className="h-[40px]">
                    <Badge variant={getStatusVariant(order.status)} className="whitespace-nowrap">
                      {statusOptions.find((s) => s.value === order.status)?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="h-[40px]">
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="whitespace-nowrap">
                      {paymentStatusOptions.find((s) => s.value === order.paymentStatus)?.label ||
                        order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {statusFilter === "REFUND_PENDING" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedOrder(order);
                                setStatus(order.status);
                                setPaymentStatus(order.paymentStatus);
                                setUpdateStatusDialogOpen(true);
                              }}
                            >
                              Cập nhật trạng thái
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedOrder(order);
                                setRefundedAmount(order.refundAmount || "0");
                                setAdminRefundNote("");
                                setRefundDialogOpen(true);
                              }}
                            >
                              Tiến hành hoàn tiền
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setStatus(order.status);
                            setPaymentStatus(order.paymentStatus);
                            setUpdateStatusDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Trang {pageNumber} / {totalPages} (Tổng: {totalCount} đơn đặt xe)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasNextPage || loading}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Order Details Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn đặt xe</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="w-full rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                <span className="text-sm text-gray-600">Mã đơn hàng: </span>
                <span className="text-base font-semibold text-blue-900">{selectedOrder.code || "N/A"}</span>
              </div>

              {/* Car Image */}
              {selectedOrder.carEvs?.model?.image && (
                <div className="flex justify-center">
                  <img
                    src={selectedOrder.carEvs.model.image}
                    alt={selectedOrder.carEvs.model.modelName}
                    className="w-full max-h-60 object-cover rounded-lg shadow-md border"
                  />
                </div>
              )}

              {/* Customer Information Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Người dùng</Label>
                    <p className="text-sm font-medium mt-1">{selectedOrder.user?.fullName || selectedOrder.user?.userName || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Email</Label>
                    <p className="text-sm mt-1">{selectedOrder.user?.userEmail || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-gray-500">Điện thoại</Label>
                    <p className="text-sm mt-1">{selectedOrder.user?.phoneNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Information Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin đặt xe</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Ngày bắt đầu</Label>
                    <p className="text-sm font-medium mt-1">{formatDate(selectedOrder.startAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Ngày kết thúc</Label>
                    <p className="text-sm font-medium mt-1">{formatDate(selectedOrder.endAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Trạng thái</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(selectedOrder.status)}>
                        {statusOptions.find((s) => s.value === selectedOrder.status)?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Information Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin thanh toán</h3>
                <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-gray-500">Tình trạng thanh toán</Label>
                    <div className="mt-1">
                      <Badge variant={getPaymentStatusVariant(selectedOrder.paymentStatus)}>
                        {paymentStatusOptions.find((s) => s.value === selectedOrder.paymentStatus)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Phương thức thanh toán</Label>
                    <p className="text-sm mt-1">
                      {paymentMethodOptions.find((m) => m.value === selectedOrder.paymentMethod)?.label ||
                        selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Loại thanh toán</Label>
                    <p className="text-sm mt-1">
                      {paymentTypeOptions.find((t) => t.value === selectedOrder.paymentType)?.label ||
                        selectedOrder.paymentType}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Tổng tiền</Label>
                    <p className="text-base font-bold text-green-700 mt-1">{vnd(parseFloat(selectedOrder.totalAmount))} VNĐ</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Tiền cọc</Label>
                    <p className="text-sm font-medium mt-1">{vnd(parseFloat(selectedOrder.depositAmount))} VNĐ</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Số tiền hoàn</Label>
                    <p className="text-sm mt-1">{vnd(parseFloat(selectedOrder.refundAmount || "0"))} VNĐ</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Car Information Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin xe</h3>
                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Xe</Label>
                    <p className="text-sm font-medium mt-1">
                      {selectedOrder.carEvs?.model?.modelName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Biển số xe</Label>
                    <p className="text-sm font-medium mt-1">{selectedOrder.carEvs?.licensePlate || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-gray-500">Trạm xe điện</Label>
                    <p className="text-sm mt-1">{selectedOrder.depot?.name || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* System Information Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin hệ thống</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Ngày tạo</Label>
                    <p className="text-sm mt-1">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500">Ngày cập nhật</Label>
                    <p className="text-sm mt-1">{formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedOrder.note && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Ghi chú</h3>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.note}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn đặt xe</DialogTitle>
            <DialogDescription>Cập nhật trạng thái và tình trạng thanh toán cho đơn đặt xe này.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Trạng thái</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as OrderBookingStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tình trạng thanh toán</Label>
              <Select
                value={paymentStatus}
                onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa đơn đặt xe</DialogTitle>
            <DialogDescription>
              {selectedOrder && (selectedOrder.status === "PENDING" || selectedOrder.status === "CANCELLED") ? (
                <>Bạn có chắc chắn muốn xóa đơn đặt xe này? Hành động này không thể hoàn tác.</>
              ) : (
                <>
                  <div className="text-red-600 font-semibold mb-2">
                    Cảnh báo: Chỉ có thể xóa đơn đặt xe ở trạng thái "Chờ xác nhận" hoặc "Đã hủy".
                  </div>
                  <div className="text-sm text-gray-600">
                    Trạng thái hiện tại: <span className="font-medium">{statusOptions.find((s) => s.value === selectedOrder?.status)?.label || selectedOrder?.status}</span>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={selectedOrder ? selectedOrder.status !== "PENDING" && selectedOrder.status !== "CANCELLED" : true}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tiến hành hoàn tiền</DialogTitle>
            <DialogDescription>
              Nhập số tiền cần hoàn và ghi chú cho đơn đặt xe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Số tiền hoàn (VNĐ)</Label>
              <Input
                type="number"
                placeholder="Nhập số tiền hoàn"
                value={refundedAmount}
                onChange={(e) => setRefundedAmount(e.target.value)}
                min={0}
              />
            </div>
            <div>
              <Label>Ghi chú của quản trị viên</Label>
              <Textarea
                placeholder="Nhập ghi chú (không bắt buộc)"
                value={adminRefundNote}
                onChange={(e) => setAdminRefundNote(e.target.value)}
                className="min-h-[96px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRefundDialogOpen(false);
              }}
              disabled={submittingRefund}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirmRefund} disabled={submittingRefund}>
              {submittingRefund ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Info Modal */}
      <UserInfoModal
        open={!!userInfoUserId}
        onOpenChange={(open) => {
          if (!open) setUserInfoUserId(null);
        }}
        userId={userInfoUserId}
      />
    </div>
  );
}
