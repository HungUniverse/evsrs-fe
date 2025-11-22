import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";
import type { TransactionResponse } from "@/@types/payment/transaction";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { UserFull } from "@/@types/auth.type";
import { formatDate } from "@/lib/utils/formatDate";
import { vnd } from "@/lib/utils/currency";
import {
  getStatusLabel,
  getPaymentStatusLabel,
  getStatusVariant,
  getPaymentStatusVariant,
} from "@/page/admin/order-management/utils/utils";

interface TransactionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionResponse | null;
  orderDetail: OrderBookingDetail | null;
  usersMap: Map<string, UserFull>;
  ordersMap: Map<string, OrderBookingDetail>;
  onViewUser: (userId: string) => void;
  onViewOrder: (orderId: string) => void;
}

export function TransactionDetailDialog({
  isOpen,
  onClose,
  transaction,
  orderDetail,
  usersMap,
  ordersMap,
  onViewUser,
  onViewOrder,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;

  const amount = parseFloat(transaction.tranferAmount || "0");
  const isIncoming = transaction.transferType === "in";

  // Get user info
  const user = transaction.userId ? usersMap.get(transaction.userId) : null;
  const userDisplayName = user
    ? user.fullName || user.userName || "N/A"
    : "Đang tải...";

  // Get order info
  const order = transaction.orderBookingId
    ? ordersMap.get(transaction.orderBookingId)
    : null;
  const orderCode =
    orderDetail?.code ||
    order?.code ||
    (transaction.orderBookingId ? "Đang tải..." : "N/A");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="z-100" />
        <DialogPrimitive.Content
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[100] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
          )}
        >
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="w-full rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 dark:bg-blue-950 dark:border-blue-800">
              <span className="text-sm text-muted-foreground">
                Mã giao dịch:{" "}
              </span>
              <span className="text-base font-semibold text-blue-900 dark:text-blue-100">
                {transaction.code || "N/A"}
              </span>
            </div>

            {/* Transaction Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Thông tin giao dịch
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Ngày giao dịch
                  </Label>
                  <p className="text-sm font-medium mt-1">
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Loại giao dịch
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={isIncoming ? "default" : "secondary"}
                      className={
                        isIncoming
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {isIncoming ? "Nhận vào" : "Gửi đi"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Số tiền
                  </Label>
                  <p
                    className={`text-base font-bold mt-1 ${isIncoming ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                  >
                    {isIncoming ? "+" : "-"} {vnd(amount)} VNĐ
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Cổng thanh toán
                  </Label>
                  <p className="text-sm mt-1">{transaction.gateway || "N/A"}</p>
                </div>
                <div className="col-span-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Số tài khoản
                    </Label>
                    <p className="text-sm mt-1">
                      {transaction.accountNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Mã tham chiếu
                    </Label>
                    <p className="text-sm mt-1 break-all">
                      {transaction.referenceCode || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Nội dung
                  </Label>
                  <p className="text-sm mt-1">{transaction.content || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Mô tả
                  </Label>
                  <p className="text-sm mt-1">
                    {transaction.description || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* User Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Thông tin người dùng
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100 dark:bg-purple-950 dark:border-purple-800">
                <div className="col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Tên khách hàng
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-medium">{userDisplayName}</p>
                    {transaction.userId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onViewUser(transaction.userId);
                          onClose();
                        }}
                        className="h-8 w-8 p-0"
                        title="Xem chi tiết người dùng"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {user && (
                  <>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Email
                      </Label>
                      <p className="text-sm mt-1">{user.userEmail || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Số điện thoại
                      </Label>
                      <p className="text-sm mt-1">
                        {user.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Order Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Thông tin đơn hàng
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-100 dark:bg-green-950 dark:border-green-800">
                <div className="col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Mã đơn hàng
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-medium">{orderCode}</p>
                    {transaction.orderBookingId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onViewOrder(transaction.orderBookingId);
                        }}
                        className="h-8 w-8 p-0"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {(orderDetail || order) && (
                  <>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Trạng thái
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            getStatusVariant((orderDetail || order)!.status) as
                              | "default"
                              | "secondary"
                              | "destructive"
                              | "outline"
                              | "soft-yellow"
                              | "soft-blue"
                              | "soft-purple"
                              | "soft-indigo"
                              | "soft-green"
                              | "soft-orange"
                              | "soft-red"
                              | "soft-gray"
                          }
                          className="whitespace-nowrap"
                        >
                          {getStatusLabel((orderDetail || order)!.status)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Tổng tiền
                      </Label>
                      <p className="text-sm font-medium mt-1">
                        {vnd(
                          parseFloat((orderDetail || order)?.totalAmount || "0")
                        )}{" "}
                        VNĐ
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">
                        Tình trạng thanh toán
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant={
                            getPaymentStatusVariant(
                              (orderDetail || order)!.paymentStatus
                            ) as
                              | "default"
                              | "secondary"
                              | "destructive"
                              | "outline"
                              | "soft-yellow"
                              | "soft-blue"
                              | "soft-purple"
                              | "soft-indigo"
                              | "soft-green"
                              | "soft-orange"
                              | "soft-red"
                              | "soft-gray"
                          }
                          className="whitespace-nowrap"
                        >
                          {getPaymentStatusLabel(
                            (orderDetail || order)!.paymentStatus
                          )}
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* System Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Thông tin hệ thống
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Ngày tạo
                  </Label>
                  <p className="text-sm mt-1">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Ngày cập nhật
                  </Label>
                  <p className="text-sm mt-1">
                    {formatDate(transaction.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Đóng</Button>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
