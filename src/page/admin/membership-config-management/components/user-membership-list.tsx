import { useMemo } from "react";
import { useUsersList } from "@/hooks/use-users-list";
import { useUserMemberships } from "@/hooks/use-user-memberships";
import { useUserOrderTotals } from "@/hooks/use-user-order-totals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { vnd } from "@/lib/utils/currency";
import { Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const getLevelBadgeProps = (level: string | null | undefined) => {
  if (!level) {
    return {
      variant: "outline" as const,
      className: "border-dashed border-muted-foreground/40 text-muted-foreground bg-muted",
    };
  }

  const normalized = level.toUpperCase();

  // Xử lý trường hợp "NONE" giống như null/undefined
  if (normalized === "NONE" || normalized === "") {
    return {
      variant: "outline" as const,
      className: "border-dashed border-muted-foreground/40 text-muted-foreground bg-muted",
    };
  }

  switch (normalized) {
    case "BRONZE":
      return {
        variant: "outline" as const,
        className:
          "border-none bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-white shadow-sm",
      };
    case "SILVER":
      return {
        variant: "outline" as const,
        className:
          "border-none bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600 text-white shadow-sm",
      };
    case "GOLD":
      return {
        variant: "outline" as const,
        className:
          "border-none bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-white shadow-sm",
      };
    default:
      return {
        variant: "outline" as const,
        className:
          "border-none bg-gradient-to-r from-primary/80 via-primary to-primary/90 text-primary-foreground shadow-sm",
      };
  }
};

const getLevelDisplayName = (level: string | null | undefined): string => {
  if (!level) return "Không có";
  const levelUpper = level.toUpperCase();
  if (levelUpper === "NONE") return "Không có";
  return level;
};

export default function UserMembershipList() {
  const { data: users, isLoading: isLoadingUsers } = useUsersList();
  const userIds = useMemo(() => (users || []).map((u) => u.id), [users]);
  const { data: memberships, isLoading: isLoadingMemberships } = useUserMemberships(userIds);
  const { data: orderTotals, isLoading: isLoadingOrderTotals } = useUserOrderTotals(userIds);

  const isLoading = isLoadingUsers || isLoadingMemberships || isLoadingOrderTotals;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Danh sách thành viên</h2>
        </div>
        <div className="rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Hạng thành viên</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Tổng giá trị đơn hàng</TableHead>
                <TableHead>Tiến độ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
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
        <Badge variant="outline" className="ml-2">
          {users.length} người dùng
        </Badge>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Hạng thành viên</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Tổng giá trị đơn hàng</TableHead>
              <TableHead>Tiến độ nâng cấp</TableHead>
            </TableRow>
          </TableHeader>
           <TableBody>
             {users.map((user) => {
               const membership = memberships?.[user.id];
               // User không có hạng thì level = "None", null, hoặc membership = null
               const hasValidMembership = 
                 membership && 
                 membership.level && 
                 membership.level.toUpperCase() !== "NONE" &&
                 membership.level.toUpperCase() !== "";
               const levelBadge = getLevelBadgeProps(membership?.level);
               const totalOrderValue = orderTotals?.[user.id] ?? 0;

               return (
                 <TableRow key={user.id}>
                   <TableCell className="font-medium whitespace-nowrap">{user.fullName || "Chưa có tên"}</TableCell>
                   <TableCell className="whitespace-nowrap">{user.userEmail}</TableCell>
                   <TableCell className="whitespace-nowrap">{user.phoneNumber || "Chưa có"}</TableCell>
                   <TableCell className="whitespace-nowrap">
                     <Badge
                       variant={levelBadge.variant}
                       className={cn("capitalize", levelBadge.className)}
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
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

