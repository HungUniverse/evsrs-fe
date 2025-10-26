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
} from "lucide-react";
import { orderBookingAPI, type OrderBookingQuery } from "@/apis/order-booking.api";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { OrderBookingStatus, PaymentStatus } from "@/@types/enum";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import { UserFullAPI } from "@/apis/user.api";
import type { UserFull } from "@/@types/auth.type";
import { Input } from "@/components/ui/input";
import { depotAPI } from "@/apis/depot.api";
import type { Depot } from "@/@types/car/depot";

type OrderBookingQueryParams = {
  pageNumber?: number;
  pageSize?: number;
};

const statusOptions: { value: OrderBookingStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "CHECKED_OUT", label: "Đã xuất xe" },
  { value: "IN_USE", label: "Đang sử dụng" },
  { value: "RETURNED", label: "Đã trả xe" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID_DEPOSIT", label: "Đã trả cọc" },
  { value: "PAID_DEPOSIT_COMPLETED", label: "Hoàn tất cọc" },
  { value: "PAID_FULL", label: "Đã thanh toán đầy đủ" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
  { value: "FAILED", label: "Thất bại" },
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
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [selectedDepotId, setSelectedDepotId] = useState<string>("");
  
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

      const response = await orderBookingAPI.getAll(params);
      
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
      toast.error("Không thể tải danh sách depot");
    }
  };

  // Fetch orders by user ID
  const fetchOrdersByUserId = async () => {
    if (!selectedUserId) {
      toast.error("Vui lòng chọn người dùng");
      return;
    }
    try {
      setLoading(true);
      const response = await orderBookingAPI.getByUserId(selectedUserId);
      
      console.log("Response from getByUserId:", response);
      
      // Check if response.data exists
      if (response.data) {
        // Response structure is ItemBaseResponse<OrderBookingDetail[]>
        // response.data.data should be an array
        const ordersData = response.data.data;
        
        if (Array.isArray(ordersData) && ordersData.length > 0) {
          setOrders(ordersData);
          setTotalPages(1);
          setTotalCount(ordersData.length);
          setHasNextPage(false);
          setHasPreviousPage(false);
          toast.success(`Tìm thấy ${ordersData.length} đơn đặt xe`);
        } else {
          // Handle empty array or non-array response
          setOrders([]);
          setTotalPages(0);
          setTotalCount(0);
          setHasNextPage(false);
          setHasPreviousPage(false);
          toast.info("Không tìm thấy đơn đặt xe nào cho người dùng này");
        }
      } else {
        setOrders([]);
        setTotalPages(0);
        setTotalCount(0);
        setHasNextPage(false);
        setHasPreviousPage(false);
        toast.info("Không tìm thấy đơn đặt xe nào cho người dùng này");
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Không thể tải đơn đặt xe của người dùng này");
      setOrders([]);
      setTotalPages(0);
      setTotalCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders by depot ID
  const fetchOrdersByDepotId = async () => {
    if (!selectedDepotId) {
      toast.error("Vui lòng chọn depot");
      return;
    }
    try {
      setLoading(true);
      const response = await orderBookingAPI.getByDepotId(selectedDepotId);
      
      if (response.data) {
        const ordersData = response.data.data;
        
        if (Array.isArray(ordersData) && ordersData.length > 0) {
          setOrders(ordersData);
          setTotalPages(1);
          setTotalCount(ordersData.length);
          setHasNextPage(false);
          setHasPreviousPage(false);
          toast.success(`Tìm thấy ${ordersData.length} đơn đặt xe`);
        } else {
          setOrders([]);
          setTotalPages(0);
          setTotalCount(0);
          setHasNextPage(false);
          setHasPreviousPage(false);
          toast.info("Không tìm thấy đơn đặt xe nào cho depot này");
        }
      } else {
        setOrders([]);
        setTotalPages(0);
        setTotalCount(0);
        setHasNextPage(false);
        setHasPreviousPage(false);
        toast.info("Không tìm thấy đơn đặt xe nào cho depot này");
      }
    } catch (error) {
      console.error("Error fetching depot orders:", error);
      toast.error("Không thể tải đơn đặt xe của depot này");
      setOrders([]);
      setTotalPages(0);
      setTotalCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
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

  // Delete order
  const handleDelete = async () => {
    if (!selectedOrder) return;

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

  // Status badge colors
  const getStatusColor = (status: OrderBookingStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-blue-500";
      case "CHECKED_OUT":
        return "bg-purple-500";
      case "IN_USE":
        return "bg-green-500";
      case "RETURNED":
        return "bg-orange-500";
      case "COMPLETED":
        return "bg-green-700";
      case "CANCELLED":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PAID_DEPOSIT":
      case "PAID_DEPOSIT_COMPLETED":
        return "bg-blue-500";
      case "PAID_FULL":
      case "COMPLETED":
        return "bg-green-500";
      case "REFUNDED":
        return "bg-orange-500";
      case "FAILED":
        return "bg-red-600";
      default:
        return "bg-gray-500";
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <Select value={selectedUserId || "all"} onValueChange={(value) => setSelectedUserId(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Lọc theo người dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả người dùng</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullName || user.userName} - {user.userEmail}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={fetchOrdersByUserId} 
              size="sm" 
              variant="outline"
              disabled={!selectedUserId || selectedUserId === ""}
            >
              Lọc
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-400" />
            <Select value={selectedDepotId || "all"} onValueChange={(value) => setSelectedDepotId(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Lọc theo depot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả depot</SelectItem>
                {depots.map((depot) => (
                  <SelectItem key={depot.id} value={depot.id}>
                    {depot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={fetchOrdersByDepotId} 
              size="sm" 
              variant="outline"
              disabled={!selectedDepotId || selectedDepotId === ""}
            >
              Lọc
            </Button>
          </div>

          <Button
            onClick={() => {
              setSelectedUserId("");
              setSelectedDepotId("");
              setSearchOrderId("");
              setPageNumber(1);
              fetchOrders({ pageNumber: 1, pageSize });
            }}
            size="sm"
            variant="outline"
          >
            Xem tất cả
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tình trạng thanh toán</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id ? order.id.slice(0, 8) + "..." : "N/A"}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user?.fullName || order.user?.userName || "N/A"}</div>
                      <div className="text-sm text-gray-500">{order.user?.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.startAt)}</TableCell>
                  <TableCell>{formatDate(order.endAt)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {statusOptions.find((s) => s.value === order.status)?.label || order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {paymentStatusOptions.find((s) => s.value === order.paymentStatus)?.label ||
                        order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{vnd(parseFloat(order.totalAmount))} VNĐ</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn đặt xe</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm">{selectedOrder.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Người dùng</Label>
                  <p className="text-sm">{selectedOrder.user?.fullName || selectedOrder.user?.userName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedOrder.user?.userEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Điện thoại</Label>
                  <p className="text-sm">{selectedOrder.user?.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày bắt đầu</Label>
                  <p className="text-sm">{formatDate(selectedOrder.startAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ngày kết thúc</Label>
                  <p className="text-sm">{formatDate(selectedOrder.endAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {statusOptions.find((s) => s.value === selectedOrder.status)?.label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tình trạng thanh toán</Label>
                  <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                    {paymentStatusOptions.find((s) => s.value === selectedOrder.paymentStatus)?.label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phương thức thanh toán</Label>
                  <p className="text-sm">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Loại thanh toán</Label>
                  <p className="text-sm">{selectedOrder.paymentType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tổng tiền</Label>
                  <p className="text-sm font-bold">{vnd(parseFloat(selectedOrder.totalAmount))} VNĐ</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tiền cọc</Label>
                  <p className="text-sm">{vnd(parseFloat(selectedOrder.depositAmount))} VNĐ</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Xe</Label>
                  <p className="text-sm">
                    {selectedOrder.carEvs?.model?.modelName 
                      ? `${selectedOrder.carEvs.model.modelName}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Biển số xe</Label>
                  <p className="text-sm">{selectedOrder.carEvs?.licensePlate || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Depot</Label>
                  <p className="text-sm">{selectedOrder.depot?.name || "N/A"}</p>
                </div>
              </div>
              {selectedOrder.note && (
                <div>
                  <Label className="text-sm font-medium">Ghi chú</Label>
                  <p className="text-sm">{selectedOrder.note}</p>
                </div>
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
              Bạn có chắc chắn muốn xóa đơn đặt xe này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
