import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import {
  CalendarPlus,
  CheckCircle2,
  Edit,
  Loader2,
  MapPin,
  MoreHorizontal,
  User,
  UserPlus,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";

interface StaffTableRowProps {
  user: UserFull;
  isSelected: boolean;
  onSelectChange: (value: boolean) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  getDepotName: (depotId: string | undefined) => string;
  depotMap: Record<string, Depot>;
  onChangeDepot: (user: UserFull) => void;
  onRequestDelete: (user: UserFull) => void;
}

export function StaffTableRow({
  user,
  isSelected,
  onSelectChange,
  isExpanded,
  onToggleExpand,
  getDepotName,
  depotMap,
  onChangeDepot,
  onRequestDelete,
}: StaffTableRowProps) {
  return (
    <React.Fragment key={user.id}>
      <TableRow
        data-state={isSelected ? "selected" : undefined}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggleExpand}
      >
        <TableCell className="w-[40px]">
          <Checkbox
            aria-label={`Select ${user.fullName}`}
            checked={isSelected}
            onCheckedChange={(value) => onSelectChange(Boolean(value))}
            onClick={(event) => event.stopPropagation()}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <img
              src={
                user.profilePicture && user.profilePicture.trim() !== ""
                  ? user.profilePicture
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`
              }
              alt={user.fullName || "Nhân viên"}
              className="size-10 rounded-full object-cover border border-muted shadow-sm"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`;
              }}
            />
            <div className="space-y-0.5">
              <div className="font-medium leading-tight">{user.fullName || "Chưa có tên"}</div>
              <div className="text-xs text-muted-foreground">{user.userName || "Chưa có tên đăng nhập"}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span>{user.phoneNumber || "Chưa có số điện thoại"}</span>
            <span className="text-xs text-muted-foreground">{user.userEmail || "Chưa có email"}</span>
          </div>
        </TableCell>
        <TableCell>{user.createdAt ? formatDate(user.createdAt) : "Chưa xác định"}</TableCell>
        <TableCell>{user.updatedAt ? formatDate(user.updatedAt) : "Chưa xác định"}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-muted-foreground" />
            <span>{getDepotName(user.depotId)}</span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleExpand();
                }}
              >
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Chỉnh sửa</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onChangeDepot(user);
                    }}
                  >
                    Thay đổi trạm
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(event) => {
                  event.stopPropagation();
                  onRequestDelete(user);
                }}
              >
                Xóa nhân viên
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <div className="border-t bg-muted/20 p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="size-4" />
                    Thông tin cơ bản
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl border bg-card shadow-sm">
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50">
                        {user.isVerify ? (
                          <CheckCircle2 className="size-5 text-emerald-600" />
                        ) : (
                          <XCircle className="size-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Trạng thái xác thực</div>
                        <Badge variant={user.isVerify ? "default" : "secondary"} className="whitespace-nowrap text-sm px-3 py-1">
                          {user.isVerify ? "Đã xác thực" : "Chưa xác thực"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InfoCard
                        icon={<CalendarPlus className="size-4 text-blue-600" />}
                        label="Tạo lúc"
                        value={user.createdAt ? formatDate(user.createdAt) : "Chưa xác định"}
                      />
                      <InfoCard
                        icon={<Edit className="size-4 text-amber-600" />}
                        label="Cập nhật"
                        value={user.updatedAt ? formatDate(user.updatedAt) : "Chưa xác định"}
                      />
                      <InfoCard
                        icon={<UserPlus className="size-4 text-purple-600" />}
                        label="Tạo bởi"
                        value={user.createdBy || "Hệ thống"}
                      />
                      <InfoCard
                        icon={<User className="size-4 text-cyan-600" />}
                        label="Cập nhật bởi"
                        value={user.updatedBy || "Chưa cập nhật"}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="size-4" />
                    Trạm làm việc
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border bg-card shadow-sm">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="whitespace-nowrap flex items-center gap-1 px-3 py-1">
                          <MapPin className="size-3" />
                          {getDepotName(user.depotId)}
                        </Badge>
                      </div>
                      {user.depotId && depotMap[user.depotId] ? (
                        <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          {depotMap[user.depotId].street}, {depotMap[user.depotId].ward}, {depotMap[user.depotId].district}, {" "}
                          {depotMap[user.depotId].province}
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-muted-foreground">Nhân viên chưa được phân công kho.</div>
                      )}
                    </div>

                    <Button variant="outline" className="w-full" onClick={() => onChangeDepot(user)}>
                      <MapPin className="size-4 mr-2" />
                      Thay đổi trạm làm việc
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted">
        {React.isValidElement(icon) ? icon : <Loader2 className="size-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

