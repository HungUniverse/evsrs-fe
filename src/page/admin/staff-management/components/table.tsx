import { useMemo, useState, useEffect } from "react";
import * as React from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { UserFull } from "@/@types/auth.type";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, ArrowUpDown, User, Trash2, Loader2 } from "lucide-react";
import { UserFullAPI } from "@/apis/user.api";
import { formatDate } from "@/lib/utils/formatDate";
import { DeleteConfirmationDialog } from "./table-components/delete-confirmation-dialog";

type SelectionMap = Record<string, boolean>;

type FilterState = {
  role: string;
};

type SortState = {
  field: string;
  direction: "asc" | "desc";
};

export function StaffTable() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserFull[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectionMap>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    users: UserFull[];
    isOpen: boolean;
  }>({ users: [], isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters and sorting
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    role: "STAFF", // Tự động filter role=STAFF cho staff-management
  });
  const [sortState, setSortState] = useState<SortState>({
    field: "fullName",
    direction: "asc",
  });

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await UserFullAPI.getAll(1, 100);
        
        const usersData = response.data.data.items || [];
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to load users:", error);
        setUsers([]); // Đặt mảng rỗng nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const rows = useMemo(() => {
    // Chỉ trả về mảng rỗng nếu users chưa được khởi tạo (undefined/null)
    // Không trả về rỗng nếu users đã là mảng rỗng []
    if (users === undefined || users === null) {
      return [];
    }

    if (!Array.isArray(users)) {
      return [];
    }

    let filtered = users;

    // Text search
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((u) => {
        return [
          u.fullName || "Chưa có tên",
          u.userName || "Chưa có tên đăng nhập", 
          u.phoneNumber || "Chưa có số điện thoại",
          u.userEmail || "Chưa có email"
        ].some((v) => String(v).toLowerCase().includes(q));
      });
    }

    // Role filter - chỉ hiển thị STAFF và loại bỏ admin hiện tại
    filtered = filtered.filter((u) => {
      // Chỉ hiển thị STAFF
      if (u.role !== "STAFF") return false;
      
      // Loại bỏ admin hiện tại nếu có
      if (currentUser && u.id === currentUser.id) return false;
      
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number, bVal: string | number;

      switch (sortState.field) {
        case "fullName":
          aVal = (a.fullName || "Chưa có tên").toLowerCase();
          bVal = (b.fullName || "Chưa có tên").toLowerCase();
          break;
        case "createdAt":
          aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        case "role":
          aVal = a.role || "STAFF";
          bVal = b.role || "STAFF";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [query, filters, sortState, users, currentUser]);

  const clearFilters = () => {
    setQuery("");
    setFilters({
      role: "STAFF", // Luôn giữ filter role=STAFF cho staff-management
    });
    setSortState({ field: "fullName", direction: "asc" });
  };

  const hasActiveFilters = query;

  // Delete user functions
  const handleDeleteUsers = () => {
    const selectedUsers = rows.filter((user) => selected[user.id]);
    if (selectedUsers.length === 0) return;

    setDeleteDialog({
      users: selectedUsers,
      isOpen: true,
    });
  };

  const confirmDeleteUsers = async () => {
    if (deleteDialog.users.length === 0) return;

    setIsDeleting(true);
    try {
      // Delete users one by one
      for (const user of deleteDialog.users) {
        await UserFullAPI.delete(user.id);
      }

      // Update local state - remove deleted users
      setUsers((prev) => prev.filter((user) => 
        !deleteDialog.users.some((deletedUser) => deletedUser.id === user.id)
      ));

      // Clear selection
      setSelected({});

      // Close dialog
      setDeleteDialog({ users: [], isOpen: false });
    } catch (error) {
      console.error("Failed to delete users:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ users: [], isOpen: false });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Thanh công cụ cải tiến */}
      <div className="space-y-3">
        {/* Tìm kiếm, bộ lọc và hành động trên cùng một hàng */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Phần bên trái: Search và Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tìm nhanh (tên / tên đăng nhập / số điện thoại / email)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-[280px] sm:w-[320px]"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <Label
                htmlFor="sort-filter"
                className="text-sm text-muted-foreground whitespace-nowrap"
              >
                Sắp xếp:
              </Label>
              <Select
                value={`${sortState.field}-${sortState.direction}`}
                onValueChange={(v) => {
                  const [field, direction] = v.split("-");
                  setSortState({ field, direction: direction as "asc" | "desc" });
                }}
              >
                <SelectTrigger id="sort-filter" className="w-[160px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullName-asc">Tên A→Z</SelectItem>
                  <SelectItem value="fullName-desc">Tên Z→A</SelectItem>
                  <SelectItem value="createdAt-desc">Ngày tạo (mới nhất)</SelectItem>
                  <SelectItem value="createdAt-asc">Ngày tạo (cũ nhất)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phần bên phải: Actions */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            )}
            
            {/* Delete button - only for selected users */}
            {Object.keys(selected).some(key => selected[key]) && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteUsers}
                className="flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                Xóa đã chọn ({Object.keys(selected).filter(key => selected[key]).length})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách nhân viên */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Số điện thoại / Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead>Kho</TableHead>
              <TableHead className="w-[60px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => {
              const selectedRow = Boolean(selected[u.id]);

              return (
                <React.Fragment key={u.id}>
                  <TableRow
                    data-state={selectedRow ? "selected" : undefined}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      const newExpandedRow = expandedRow === u.id ? null : u.id;
                      setExpandedRow(newExpandedRow);
                    }}
                  >
                    <TableCell className="w-[40px]">
                      <Checkbox
                        aria-label={`Select ${u.fullName}`}
                        checked={selectedRow}
                        onCheckedChange={(v) =>
                          setSelected((s) => ({ ...s, [u.id]: Boolean(v) }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName || "User")}`}
                          alt={u.fullName || "Nhân viên"}
                          className="size-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium leading-tight">
                            {u.fullName || "Chưa có tên"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {u.userName || "Chưa có tên đăng nhập"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Phone / Email */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{u.phoneNumber || "Chưa có số điện thoại"}</span>
                        <span className="text-xs text-muted-foreground">
                          {u.userEmail || "Chưa có email"}
                        </span>
                      </div>
                    </TableCell>
                    {/* Vai trò */}
                    <TableCell>
                      <Badge variant="secondary">
                        {u.role || "STAFF"}
                      </Badge>
                    </TableCell>
                    {/* Created */}
                    <TableCell>{u.createdAt ? formatDate(u.createdAt) : "Chưa xác định"}</TableCell>
                    {/* Updated */}
                    <TableCell>{u.updatedAt ? formatDate(u.updatedAt) : "Chưa xác định"}</TableCell>
                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Xem</DropdownMenuItem>
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Nhật ký kiểm tra</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({
                                users: [u],
                                isOpen: true,
                              });
                            }}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Xóa nhân viên
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Row Expansions */}
                  {expandedRow === u.id && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="p-0"
                      >
                        <div className="border-t bg-muted/20 p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center gap-2">
                                <User className="size-4" />
                                Thông tin cơ bản
                              </h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">
                                    Role:
                                  </span>
                                  <span className="ml-2">
                                    <Badge variant="secondary">{u.role || "STAFF"}</Badge>
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Đã xác thực:
                                  </span>
                                  <span className="ml-2">
                                    <Badge
                                      variant={
                                        u.isVerify ? "default" : "secondary"
                                      }
                                    >
                                      {u.isVerify ? "Có" : "Không"}
                                    </Badge>
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Tạo lúc:
                                  </span>
                                  <span className="ml-2">
                                    {u.createdAt ? formatDate(u.createdAt) : "Chưa xác định"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Cập nhật:
                                  </span>
                                  <span className="ml-2">
                                    {u.updatedAt ? formatDate(u.updatedAt) : "Chưa xác định"}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Tạo bởi:
                                  </span>
                                  <span className="ml-2">{u.createdBy || "Hệ thống"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Cập nhật bởi:
                                  </span>
                                  <span className="ml-2">{u.updatedBy || "Chưa cập nhật"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận xóa nhân viên */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteUsers}
        users={deleteDialog.users}
        isDeleting={isDeleting}
      />
    </div>
  );
}
