import { useMemo, useState, useEffect } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { UserFull, StaffRequest } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, ArrowUpDown, User, Trash2, Loader2, MapPin, Plus, RotateCcw, CheckCircle2, XCircle, CalendarPlus, UserPlus, Edit } from "lucide-react";
import { UserFullAPI } from "@/apis/user.api";
import { depotAPI } from "@/apis/depot.api";
import { formatDate } from "@/lib/utils/formatDate";
import { DeleteConfirmationDialog } from "./table-components/delete-confirmation-dialog";

type SelectionMap = Record<string, boolean>;

type SortState = {
  field: string;
  direction: "asc" | "desc";
};

export function StaffTable() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserFull[]>([]);
  const [depots, setDepots] = useState<Record<string, Depot>>({});
  const [depotList, setDepotList] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectionMap>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    users: UserFull[];
    isOpen: boolean;
  }>({ users: [], isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);
  // Change depot dialog state
  const [changeDepotDialog, setChangeDepotDialog] = useState<{
    isOpen: boolean;
    user: UserFull | null;
    selectedDepotId: string;
    isSubmitting: boolean;
  }>({ isOpen: false, user: null, selectedDepotId: "", isSubmitting: false });
  
  // Create staff dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Filters and sorting
  const [query, setQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    field: "fullName",
    direction: "asc",
  });

  // Form handling for create staff
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffRequest>();

  // Load users data and fetch depot details for staff
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load users first
        const usersResponse = await UserFullAPI.getAll(1, 100);
        const usersData = usersResponse.data.data.items || [];
        setUsers(usersData);

        // Load depot list for dropdown
        const depotResponse = await depotAPI.getAll(1, 100);
        const depotData = depotResponse.data.data.items || [];
        setDepotList(depotData);

        // Get unique depot IDs from staff users
        const depotIds = [...new Set(
          usersData
            .filter((user: UserFull) => user.role === "STAFF" && user.depotId)
            .map((user: UserFull) => user.depotId!)
        )];

        // Fetch depot details for each unique depot ID
        const depotPromises = depotIds.map(async (depotId: string) => {
          try {
            const depot = await depotAPI.getById(depotId);
            return { depotId, depot };
          } catch (error) {
            console.error(`Failed to load depot ${depotId}:`, error);
            return null;
          }
        });

        const depotResults = await Promise.all(depotPromises);
        const depotMap: Record<string, Depot> = {};
        
        depotResults.forEach(result => {
          if (result) {
            depotMap[result.depotId] = result.depot;
          }
        });

        setDepots(depotMap);
      } catch (error) {
        console.error("Failed to load data:", error);
        setUsers([]);
        setDepots({});
        setDepotList([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to get depot name by ID
  const getDepotName = (depotId: string | undefined): string => {
    if (!depotId) return "Chưa phân công";
    const depot = depots[depotId];
    return depot ? depot.name : "Không tìm thấy";
  };

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
  }, [query, sortState, users, currentUser]);

  const clearFilters = () => {
    setQuery("");
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

  // Create staff functions
  const handleCreateStaff = async (data: StaffRequest) => {
    setIsCreating(true);
    try {
      const newStaff = await UserFullAPI.createStaff(data);
      setUsers(prev => [...prev, newStaff]);
      setCreateDialogOpen(false);
      reset();
      toast.success("Tạo nhân viên thành công!");
    } catch (error) {
      console.error("Failed to create staff:", error);
      toast.error("Không thể tạo nhân viên. Vui lòng thử lại.");
    } finally {
      setIsCreating(false);
    }
  };

  const openCreateDialog = () => {
    reset();
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    reset();
  };

  // Change depot handlers
  const openChangeDepotForUser = (user: UserFull) => {
    setChangeDepotDialog({
      isOpen: true,
      user,
      selectedDepotId: user.depotId || "",
      isSubmitting: false,
    });
  };

  const closeChangeDepotDialog = () => {
    setChangeDepotDialog({ isOpen: false, user: null, selectedDepotId: "", isSubmitting: false });
  };

  const confirmChangeDepot = async () => {
    if (!changeDepotDialog.user || !changeDepotDialog.selectedDepotId) {
      toast.error("Vui lòng chọn kho làm việc");
      return;
    }
    try {
      setChangeDepotDialog((s) => ({ ...s, isSubmitting: true }));
      await UserFullAPI.updateDepot(changeDepotDialog.user.id, changeDepotDialog.selectedDepotId);

      // Update local users list
      setUsers((prev) =>
        prev.map((u) =>
          u.id === changeDepotDialog.user!.id ? { ...u, depotId: changeDepotDialog.selectedDepotId } : u
        )
      );

      // Ensure depot map has the selected depot details for name rendering
      const depotInfo = depotList.find((d) => d.id === changeDepotDialog.selectedDepotId);
      if (depotInfo) {
        setDepots((prev) => ({ ...prev, [depotInfo.id]: depotInfo }));
      }

      toast.success("Cập nhật kho làm việc thành công");
      closeChangeDepotDialog();
    } catch (error) {
      console.error("Failed to update depot:", error);
      toast.error("Không thể cập nhật kho. Vui lòng thử lại.");
      setChangeDepotDialog((s) => ({ ...s, isSubmitting: false }));
    }
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
            {/* Add Staff button */}
            <Button 
              onClick={openCreateDialog}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus className="size-4" />
              Thêm nhân viên
            </Button>

            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="group text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50"
              >
                <RotateCcw className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                Đặt lại bộ lọc
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
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead>Trạm</TableHead>
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
                    {/* Checkbox */}
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
                    {/* Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.profilePicture && u.profilePicture.trim() !== ""
                              ? u.profilePicture
                              : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName || "User")}`
                          }
                          alt={u.fullName || "Nhân viên"}
                          className="size-8 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName || "User")}`;
                          }}
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
                    {/* Created */}
                    <TableCell>{u.createdAt ? formatDate(u.createdAt) : "Chưa xác định"}</TableCell>
                    {/* Updated */}
                    <TableCell>{u.updatedAt ? formatDate(u.updatedAt) : "Chưa xác định"}</TableCell>
                    {/* Depot */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                          {getDepotName(u.depotId)}
                        </span>
                      </div>
                    </TableCell>
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
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Chỉnh sửa</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openChangeDepotForUser(u);
                                }}
                              >
                                Thay đổi Trạm
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          
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
                            <Trash2 className="size-4 mr-2 text-red-600" />
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
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50">
                                    {u.isVerify ? (
                                      <CheckCircle2 className="size-5 text-emerald-600" />
                                    ) : (
                                      <XCircle className="size-5 text-red-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs text-muted-foreground mb-0.5">Trạng thái xác thực</div>
                                    <Badge
                                      variant={u.isVerify ? "default" : "secondary"}
                                      className="text-sm"
                                    >
                                      {u.isVerify ? "Đã xác thực" : "Chưa xác thực"}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                                    <CalendarPlus className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs text-muted-foreground mb-0.5">Tạo lúc</div>
                                      <div className="text-sm font-medium truncate">
                                        {u.createdAt ? formatDate(u.createdAt) : "Chưa xác định"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                                    <Edit className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs text-muted-foreground mb-0.5">Cập nhật</div>
                                      <div className="text-sm font-medium truncate">
                                        {u.updatedAt ? formatDate(u.updatedAt) : "Chưa xác định"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                                    <UserPlus className="size-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs text-muted-foreground mb-0.5">Tạo bởi</div>
                                      <div className="text-sm font-medium truncate">
                                        {u.createdBy || "Hệ thống"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                                    <User className="size-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs text-muted-foreground mb-0.5">Cập nhật bởi</div>
                                      <div className="text-sm font-medium truncate">
                                        {u.updatedBy || "Chưa cập nhật"}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 rounded-lg border bg-card">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="size-4 text-rose-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs text-muted-foreground mb-2">Trạm làm việc</div>
                                      <Badge variant="outline" className="flex items-center gap-1 w-fit mb-2">
                                        <MapPin className="size-3" />
                                        {getDepotName(u.depotId)}
                                      </Badge>
                                      {u.depotId && depots[u.depotId] && (
                                        <div className="text-sm text-muted-foreground">
                                          <MapPin className="size-3 inline mr-1" />
                                          {depots[u.depotId].street}, {depots[u.depotId].ward}, {depots[u.depotId].district}, {depots[u.depotId].province}
                                        </div>
                                      )}
                                    </div>
                                  </div>
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

      {/* Change Depot Dialog */}
      <Dialog open={changeDepotDialog.isOpen} onOpenChange={(open) => (open ? null : closeChangeDepotDialog())}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Thay đổi trạm làm việc</DialogTitle>
            <DialogDescription>
              Chọn trạm mới cho nhân viên {changeDepotDialog.user?.fullName || changeDepotDialog.user?.userName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Trạm làm việc</Label>
            <Select
              value={changeDepotDialog.selectedDepotId}
              onValueChange={(val) => setChangeDepotDialog((s) => ({ ...s, selectedDepotId: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạm" />
              </SelectTrigger>
              <SelectContent>
                {depotList.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeChangeDepotDialog} disabled={changeDepotDialog.isSubmitting}>
              Hủy
            </Button>
            <Button type="button" onClick={confirmChangeDepot} disabled={changeDepotDialog.isSubmitting}>
              {changeDepotDialog.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Staff Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
            <DialogDescription>
              Điền đầy đủ thông tin để tạo tài khoản nhân viên mới.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleCreateStaff)} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-4 flex-1 overflow-y-auto">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Họ và tên <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Nhập họ và tên đầy đủ"
                  {...register("fullName", {
                    required: "Họ và tên là bắt buộc",
                    minLength: {
                      value: 2,
                      message: "Họ và tên phải có ít nhất 2 ký tự"
                    }
                  })}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* User Name */}
              <div className="space-y-2">
                <Label htmlFor="userName">
                  Tên đăng nhập <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="userName"
                  placeholder="Nhập tên đăng nhập"
                  {...register("userName", {
                    required: "Tên đăng nhập là bắt buộc",
                    minLength: {
                      value: 3,
                      message: "Tên đăng nhập phải có ít nhất 3 ký tự"
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
                    }
                  })}
                  className={errors.userName ? "border-red-500" : ""}
                />
                {errors.userName && (
                  <p className="text-sm text-red-500">{errors.userName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="userEmail">
                  Email <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  {...register("userEmail", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ"
                    }
                  })}
                  className={errors.userEmail ? "border-red-500" : ""}
                />
                {errors.userEmail && (
                  <p className="text-sm text-red-500">{errors.userEmail.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Số điện thoại <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  {...register("phoneNumber", {
                    required: "Số điện thoại là bắt buộc",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Số điện thoại phải có 10-11 chữ số"
                    }
                  })}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Ngày sinh <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", {
                    required: "Ngày sinh là bắt buộc"
                  })}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Depot Selection */}
              <div className="space-y-2">
                <Label htmlFor="depotId">
                  Trạm làm việc <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("depotId", value)}
                  value={watch("depotId") || ""}
                >
                  <SelectTrigger className={errors.depotId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Chọn trạm làm việc" />
                  </SelectTrigger>
                  <SelectContent>
                    {depotList.map((depot) => (
                      <SelectItem key={depot.id} value={depot.id}>
                        {depot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.depotId && (
                  <p className="text-sm text-red-500">{errors.depotId.message}</p>
                )}
              </div>

              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profilePicture">Ảnh đại diện</Label>
                <Input
                  id="profilePicture"
                  placeholder="URL ảnh đại diện (tùy chọn)"
                  {...register("profilePicture")}
                />
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 mt-4">
              <Button type="button" variant="outline" onClick={closeCreateDialog}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo nhân viên"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
