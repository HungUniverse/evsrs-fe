import { useMemo, useState } from "react";
import { useUsersList } from "../hooks/use-users-list";
import { useUserMemberships } from "../hooks/use-user-memberships";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { vnd } from "@/lib/utils/currency";
import { Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLevelBadgeProps, getLevelDisplayName } from "../utils/level";

export default function UserMembershipList() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const { data: users, isLoading: isLoadingUsers } = useUsersList();
  const userIds = useMemo(() => (users || []).map((u) => u.id), [users]);
  const { data: memberships, isLoading: isLoadingMemberships } = useUserMemberships(userIds);

  const isLoading = isLoadingUsers || isLoadingMemberships;
  const pagination = useTablePagination({
    items: users || [],
    pageNumber,
    pageSize,
    setPageNumber,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Danh sách thành viên</h2>
        </div>
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-[#D1FAE5]">
              <TableRow>
                <TableHead className="w-16 text-center text-[#065F46]">STT</TableHead>
                <TableHead className="text-[#065F46]">Họ tên</TableHead>
                <TableHead className="text-[#065F46]">Email</TableHead>
                <TableHead className="text-[#065F46]">Số điện thoại</TableHead>
                <TableHead className="text-[#065F46]">Hạng thành viên</TableHead>
                <TableHead className="text-[#065F46]">Giảm giá</TableHead>
                <TableHead className="text-[#065F46]">Tổng giá trị đơn hàng</TableHead>
                <TableHead className="text-[#065F46]">Tiến độ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Danh sách thành viên</h2>
        </div>
        <div className="rounded-lg border bg-white shadow-sm p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Không có người dùng nào trong hệ thống</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Danh sách thành viên</h2>
        <Badge variant="outline" className="whitespace-nowrap ml-2">
          {users.length} người dùng
        </Badge>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#D1FAE5]">
            <TableRow>
              <TableHead className="w-16 text-center text-[#065F46] sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">STT</TableHead>
              <TableHead className="text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Họ tên</TableHead>
              <TableHead className="text-[#065F46]">Email</TableHead>
              <TableHead className="text-[#065F46]">Số điện thoại</TableHead>
              <TableHead className="text-[#065F46]">Hạng thành viên</TableHead>
              <TableHead className="text-[#065F46]">Giảm giá</TableHead>
              <TableHead className="text-[#065F46]">Tổng giá trị đơn hàng</TableHead>
              <TableHead className="text-[#065F46]">Tiến độ nâng cấp</TableHead>
            </TableRow>
          </TableHeader>
           <TableBody>
             {pagination.paginatedData.map((user, index) => {
               const membership = memberships?.[user.id];
               // User không có hạng thì level = "None", null, hoặc membership = null
               const hasValidMembership = 
                 membership && 
                 membership.level && 
                 membership.level.toUpperCase() !== "NONE" &&
                 membership.level.toUpperCase() !== "";
               const levelBadge = getLevelBadgeProps(membership?.level);
               const totalOrderValue = memberships?.[user.id]?.totalOrderBill ?? 0;

               return (
                 <TableRow key={user.id} className="hover:bg-muted/50 transition-colors group">
                   <TableCell className="whitespace-nowrap text-center sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors w-16 text-muted-foreground">
                     {pagination.startItem + index}
                   </TableCell>
                   <TableCell className="font-medium whitespace-nowrap sticky left-16 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
                     {user.fullName || "Chưa có tên"}
                   </TableCell>
                   <TableCell className="whitespace-nowrap">{user.userEmail}</TableCell>
                   <TableCell className="whitespace-nowrap">{user.phoneNumber || "Chưa có"}</TableCell>
                   <TableCell className="whitespace-nowrap">
                     <Badge
                       variant={levelBadge.variant}
                       className={cn("whitespace-nowrap capitalize", levelBadge.className)}
                     >
                       <Award className="h-3 w-3 mr-1" />
                       {getLevelDisplayName(membership?.level)}
                     </Badge>
                   </TableCell>
                   <TableCell className="whitespace-nowrap">
                     {hasValidMembership && membership?.discountPercent !== undefined 
                       ? `${membership.discountPercent}%` 
                       : "-"}
                   </TableCell>
                   <TableCell className="whitespace-nowrap">
                     {vnd(totalOrderValue)} VNĐ
                   </TableCell>
                   <TableCell className="whitespace-nowrap">
                     {hasValidMembership && membership?.nextLevelName ? (
                       <div className="flex flex-col gap-1">
                         <div className="text-xs text-muted-foreground">
                           Cần thêm {vnd(membership.amountToNextLevel ?? 0)} VNĐ để lên {membership.nextLevelName}
                         </div>
                         <div className="w-full bg-muted rounded-full h-2">
                           <div
                             className="bg-primary h-2 rounded-full transition-all"
                             style={{ width: `${Math.min(membership.progressToNextLevel ?? 0, 100)}%` }}
                           />
                         </div>
                       </div>
                     ) : hasValidMembership ? (
                       <span className="text-xs text-muted-foreground">Đã đạt hạng cao nhất</span>
                     ) : (
                       <span className="text-xs text-muted-foreground">Chưa có hạng</span>
                     )}
                   </TableCell>
                 </TableRow>
               );
             })}
            {pagination.paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        startItem={pagination.startItem}
        endItem={pagination.endItem}
        totalItems={pagination.totalItems}
        onPreviousPage={pagination.handlePreviousPage}
        onNextPage={pagination.handleNextPage}
        onPageChange={pagination.setPageNumber}
        loading={isLoading}
      />
    </div>
  );
}

