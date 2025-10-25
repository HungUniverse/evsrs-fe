import { useMemo, useState, useEffect } from "react";
import * as React from "react";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { identifyDocumentAPI } from "@/apis/identify-document.api";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, ShieldCheck, AlertTriangle, Minus, ArrowUpDown, FileText, User, Eye, Trash2, Loader2 } from "lucide-react";
import { UserFullAPI } from "@/apis/user.api";
import { formatDate } from "@/lib/utils/formatDate";
import type { IdentifyDocumentStatus } from "@/@types/enum";
import { ImageModal, DocumentVerificationModal, StatusChangeDialog, DeleteConfirmationDialog } from "./table-components";

function getImageUrl(imageString: string | null): string {
  if (!imageString) return "";

  // Nếu đã có prefix data: thì dùng trực tiếp
  if (imageString.startsWith("data:")) {
    return imageString;
  }

  // Nếu là URL thì dùng trực tiếp
  if (imageString.startsWith("http")) {
    return imageString;
  }

  // Mặc định coi như base64 string và thêm prefix
  return `data:image/jpeg;base64,${imageString}`;
}

type SelectionMap = Record<string, boolean>;

type FilterState = {
  role: string;
};

type SortState = {
  field: string;
  direction: "asc" | "desc";
};

function getDocStatus(
  hasImage: boolean | undefined,
  status: IdentifyDocumentStatus
) {
  if (!hasImage) return "missing" as const;
  if (status === "APPROVED") return "ok" as const;
  return "review" as const;
}

export function RenterTable() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserFull[]>([]);
  const [documents, setDocuments] = useState<
    Record<string, IdentifyDocumentResponse | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectionMap>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [documentDialog, setDocumentDialog] = useState<{
    user: UserFull | null;
    document: IdentifyDocumentResponse | null;
    action: "approve" | "reject";
  }>({ user: null, document: null, action: "approve" });
  const [verificationNotes, setVerificationNotes] = useState("");
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    user: UserFull | null;
    document: IdentifyDocumentResponse | null;
    newStatus: "APPROVED" | "REJECTED";
    currentStatus: IdentifyDocumentStatus;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    users: UserFull[];
    isOpen: boolean;
  }>({ users: [], isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters and sorting
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    role: "USER", // Tự động filter role=USER cho renter-management
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
        
        const usersData =  response.data.data.items ; //ignore this error
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

  // Load documents for all USER role when filter changes to USER
  useEffect(() => {
    const loadAllUserDocuments = async () => {
      if (filters.role !== "USER") return;
      
      // Get all users with USER role
      const userRoleUsers = users.filter(user => user.role === "USER");
      
      // Load documents for all USER role users
      for (const user of userRoleUsers) {
        if (documents[user.id] === undefined) {
          try {
            const docResponse = await identifyDocumentAPI.getUserDocuments(user.id);
            setDocuments((prev) => ({
              ...prev,
              [user.id]: docResponse.data,
            }));
          } catch {
            setDocuments((prev) => ({
              ...prev,
              [user.id]: null,
            }));
          }
        }
      }
    };

    loadAllUserDocuments();
  }, [filters.role, users, documents]);

  // Load document for specific user when row is expanded
  const loadUserDocument = async (userId: string) => {
    // Only load if not already loaded
    if (documents[userId] !== undefined) return;

    try {
      const docResponse = await identifyDocumentAPI.getUserDocuments(userId);

      setDocuments((prev) => ({
        ...prev,
        [userId]: docResponse.data,
      }));
    } catch {
      setDocuments((prev) => ({
        ...prev,
        [userId]: null,
      }));
    }
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

    // Role filter - chỉ hiển thị USER và loại bỏ admin hiện tại
    filtered = filtered.filter((u) => {
      // Chỉ hiển thị USER
      if ((u.role || "USER") !== "USER") return false;
      
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
          aVal = a.role || "USER";
          bVal = b.role || "USER";
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
    setFilters({
      role: "USER", // Luôn giữ filter role=USER cho renter-management
    });
    setSortState({ field: "fullName", direction: "asc" });
  };

  const hasActiveFilters = query;

  const handleDocumentVerification = async (user: UserFull) => {
    // Load document if not already loaded
    if (documents[user.id] === undefined) {
      await loadUserDocument(user.id);
    }

    const document = documents[user.id];
    if (!document) return;

    setDocumentDialog({
      user,
      document,
      action: document.status === "PENDING" ? "approve" : "approve",
    });
    setVerificationNotes("");
  };

  const handleStatusToggle = async (
    user: UserFull,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    // Load document if not already loaded
    if (documents[user.id] === undefined) {
      await loadUserDocument(user.id);
    }

    const document = documents[user.id];
    if (!document) return;

    // Show confirmation dialog
    setStatusChangeDialog({
      user,
      document,
      newStatus,
      currentStatus: document.status,
    });
  };

  const confirmStatusChange = async () => {
    if (
      !statusChangeDialog ||
      !statusChangeDialog.document ||
      !statusChangeDialog.user
    )
      return;

    try {
      // Use document ID from the loaded document
      await identifyDocumentAPI.updateStatus(statusChangeDialog.document.id, {
        status: statusChangeDialog.newStatus,
        note: verificationNotes || undefined,
      });

      // Update local state
      setDocuments((prev) => ({
        ...prev,
        [statusChangeDialog.user!.id]: {
          ...statusChangeDialog.document!,
          status: statusChangeDialog.newStatus,
          verifiedBy: currentUser?.name || "Unknown",
          verifiedAt: new Date().toISOString(),
          note: verificationNotes || undefined,
        },
      }));

      // Close dialog
      setStatusChangeDialog(null);
      setVerificationNotes("");
    } catch (error) {
      console.error("Failed to update document status:", error);
    }
  };

  const confirmDocumentVerification = async () => {
    if (!documentDialog.user || !documentDialog.document) return;

    try {
      const newStatus =
        documentDialog.action === "approve" ? "APPROVED" : "REJECTED";

      // Use document ID from the loaded document
      await identifyDocumentAPI.updateStatus(documentDialog.document.id, {
        status: newStatus,
        note: verificationNotes || undefined,
      });

      // Update local state
      setDocuments((prev) => ({
        ...prev,
        [documentDialog.user!.id]: {
          ...documentDialog.document!,
          status: newStatus,
          verifiedBy: currentUser?.name || "Unknown",
          verifiedAt: new Date().toISOString(),
          note: verificationNotes || undefined,
        },
      }));

      // Close dialog
      setDocumentDialog({ user: null, document: null, action: "approve" });
      setVerificationNotes("");
    } catch (error) {
      console.error("Failed to update document status:", error);
    }
  };

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

  const showDocumentColumns = filters.role === "USER";

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

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              
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
                    <SelectItem value="role-asc">Vai trò A→Z</SelectItem>
                    <SelectItem value="role-desc">Vai trò Z→A</SelectItem>
                    <SelectItem value="createdAt-desc">Ngày tạo (mới nhất)</SelectItem>
                    <SelectItem value="createdAt-asc">Ngày tạo (cũ nhất)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

      {/* Danh sách người dùng */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Số điện thoại / Email</TableHead>
              <TableHead>Vai trò</TableHead>
              {showDocumentColumns && <TableHead>Tài liệu</TableHead>}
              {showDocumentColumns && <TableHead>Xác thực</TableHead>}
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className="w-[60px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => {
              const selectedRow = Boolean(selected[u.id]);
              const document = documents[u.id];
              const hasDocumentLoaded = documents[u.id] !== undefined;
              const frontDoc = hasDocumentLoaded
                ? getDocStatus(
                  Boolean(document?.frontImage),
                  document?.status || "PENDING"
                )
                : "loading";
              const backDoc = hasDocumentLoaded
                ? getDocStatus(
                  Boolean(document?.backImage),
                  document?.status || "PENDING"
                )
                : "loading";

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
                          alt={u.fullName || "Người dùng"}
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
                      <Badge
                        variant={
                          u.role === "ADMIN"
                            ? "destructive"
                            : u.role === "STAFF"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {u.role || "Chưa có"}
                      </Badge>
                    </TableCell>
                    {/* Tài liệu - Chỉ hiển thị cho role USER */}
                    {showDocumentColumns && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  {frontDoc === "loading" ? (
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                  ) : frontDoc === "ok" ? (
                                    <ShieldCheck className="text-emerald-500" />
                                  ) : frontDoc === "review" ? (
                                    <AlertTriangle className="text-amber-500" />
                                  ) : (
                                    <Minus className="text-muted-foreground" />
                                  )}
                                  <span className="text-xs">Mặt trước</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Mặt trước:{" "}
                                {frontDoc === "loading"
                                  ? "Đang tải..."
                                  : frontDoc === "ok"
                                    ? "Đã xác thực"
                                    : frontDoc === "review"
                                      ? "Cần review"
                                      : "Thiếu"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  {backDoc === "loading" ? (
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                  ) : backDoc === "ok" ? (
                                    <ShieldCheck className="text-emerald-500" />
                                  ) : backDoc === "review" ? (
                                    <AlertTriangle className="text-amber-500" />
                                  ) : (
                                    <Minus className="text-muted-foreground" />
                                  )}
                                  <span className="text-xs">Mặt sau</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Mặt sau:{" "}
                                {backDoc === "loading"
                                  ? "Đang tải..."
                                  : backDoc === "ok"
                                    ? "Đã xác thực"
                                    : backDoc === "review"
                                      ? "Cần review"
                                      : "Thiếu"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    )}
                    {/* Xác thực - Chỉ hiển thị cho role USER */}
                    {showDocumentColumns && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!hasDocumentLoaded ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                          ) : document ? (
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={
                                  document.status === "APPROVED"
                                    ? "default"
                                    : document.status === "REJECTED"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {document.status}
                              </Badge>

                              {document.status !== "PENDING" && (
                                <div className="flex items-center gap-2">
                                  <button
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${document.status === "APPROVED"
                                        ? "bg-blue-600"
                                        : "bg-gray-200"
                                      }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newStatus =
                                        document.status === "APPROVED"
                                          ? "REJECTED"
                                          : "APPROVED";
                                      handleStatusToggle(u, newStatus);
                                    }}
                                  >
                                    <span
                                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${document.status === "APPROVED"
                                          ? "translate-x-5"
                                          : "translate-x-1"
                                        }`}
                                    />
                                  </button>
                                  <span className="text-xs text-muted-foreground">
                                    {document.status === "APPROVED"
                                      ? "Đã duyệt"
                                      : "Đã từ chối"}
                                  </span>
                                </div>
                              )}

                              {document.status === "PENDING" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDocumentVerification(u);
                                  }}
                                >
                                  Xác thực
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">Không có tài liệu</Badge>
                          )}
                        </div>
                      </TableCell>
                    )}
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
                          {showDocumentColumns && document && (
                            <DropdownMenuItem
                              onClick={() => handleDocumentVerification(u)}
                            >
                              Xác thực tài liệu
                            </DropdownMenuItem>
                          )}
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
                            Xóa người dùng
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Row Expansions */}
                  {expandedRow === u.id && (
                    <TableRow>
                      <TableCell
                        colSpan={showDocumentColumns ? 8 : 6}
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
                                    <Badge variant="outline">{u.role || "Chưa có"}</Badge>
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

                            {/* Documents - Only show for USER role */}
                            {showDocumentColumns && (
                              <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <FileText className="size-4" />
                                  Tài liệu
                                </h4>
                                {!hasDocumentLoaded ? (
                                  <div className="flex items-center justify-center p-8">
                                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      Đang tải tài liệu...
                                    </span>
                                  </div>
                                ) : document ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Mã quốc gia:
                                        </span>
                                        <div className="text-sm">
                                          {document.countryCode || "Chưa có mã quốc gia"}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Số GPLX:
                                        </span>
                                        <div className="text-sm">
                                          {document.numberMasked || "Chưa có số GPLX"}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex gap-4">
                                      {/* Ảnh mặt trước */}
                                      <div className="flex-1 space-y-2">
                                        <span className="text-sm text-muted-foreground">
                                          Ảnh mặt trước:
                                        </span>
                                        {document.frontImage ? (
                                          <div className="relative group">
                                            <img
                                              src={getImageUrl(
                                                document.frontImage
                                              )}
                                              alt="Front Document"
                                              className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                              onError={() => {
                                                console.error("Front image load error");
                                              }}
                                              onClick={() => {
                                                if (document.frontImage) {
                                                  setImageModalOpen({
                                                    url: getImageUrl(
                                                      document.frontImage
                                                    ),
                                                    title:
                                                      "Front Document - " +
                                                      (u.fullName || "Người dùng"),
                                                  });
                                                }
                                              }}
                                            />
                                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded border flex items-center justify-center pointer-events-none">
                                              <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Eye className="size-3 text-gray-700" />
                                                <span className="text-xs font-medium text-gray-700">
                                                  Click để xem
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full h-20 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                                            Không có ảnh mặt trước
                                          </div>
                                        )}
                                      </div>

                                      {/* Ảnh mặt sau */}
                                      <div className="flex-1 space-y-2">
                                        <span className="text-sm text-muted-foreground">
                                          Ảnh mặt sau:
                                        </span>
                                        {document.backImage ? (
                                          <div className="relative group">
                                            <img
                                              src={getImageUrl(
                                                document.backImage
                                              )}
                                              alt="Back Document"
                                              className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                              onError={() => {
                                                console.error("Back image load error");
                                              }}
                                              onClick={() => {
                                                if (document.backImage) {
                                                  setImageModalOpen({
                                                    url: getImageUrl(
                                                      document.backImage
                                                    ),
                                                    title:
                                                      "Back Document - " +
                                                      (u.fullName || "Người dùng"),
                                                  });
                                                }
                                              }}
                                            />
                                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded border flex items-center justify-center pointer-events-none">
                                              <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Eye className="size-3 text-gray-700" />
                                                <span className="text-xs font-medium text-gray-700">
                                                  Click để xem
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full h-20 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                                            Không có ảnh mặt sau
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="text-sm">
                                      <span className="text-muted-foreground">
                                        Xác thực bởi:
                                      </span>
                                      <span className="ml-2">
                                        {document.verifiedBy || "Chưa được xác thực"}
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">
                                        Ngày xác thực:
                                      </span>
                                      <span className="ml-2">
                                        {document.verifiedAt ? formatDate(document.verifiedAt) : "Chưa xác thực"}
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">
                                        Ghi chú:
                                      </span>
                                      <span className="ml-2">
                                        {document.note || "Không có ghi chú"}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground">
                                    Chưa có tài liệu
                                  </div>
                                )}
                              </div>
                            )}
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

      {/* Modal ảnh tài liệu */}
      <ImageModal
        isOpen={!!imageModalOpen}
        onClose={() => setImageModalOpen(null)}
        imageUrl={imageModalOpen?.url || null}
        title={imageModalOpen?.title || null}
      />

      {/* Modal xác thực tài liệu */}
      <DocumentVerificationModal
        isOpen={!!documentDialog.user}
        onClose={() =>
          setDocumentDialog({ user: null, document: null, action: "approve" })
        }
        user={documentDialog.user}
        document={documentDialog.document}
        action={documentDialog.action}
        onActionChange={(action: "approve" | "reject") =>
          setDocumentDialog({ ...documentDialog, action })
        }
        verificationNotes={verificationNotes}
        onNotesChange={setVerificationNotes}
        onConfirm={confirmDocumentVerification}
      />

      {/* Modal xác thực trạng thái */}
      <StatusChangeDialog
        isOpen={!!statusChangeDialog}
        onClose={() => setStatusChangeDialog(null)}
        user={statusChangeDialog?.user || null}
        document={statusChangeDialog?.document || null}
        newStatus={statusChangeDialog?.newStatus || "APPROVED"}
        currentStatus={statusChangeDialog?.currentStatus || "PENDING"}
        verificationNotes={verificationNotes}
        onNotesChange={setVerificationNotes}
        onConfirm={confirmStatusChange}
      />

      {/* Modal xác nhận xóa người dùng */}
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
