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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoreHorizontal, ShieldCheck, AlertTriangle, Minus, Filter, ArrowUpDown, ExternalLink, FileText, User, Eye } from "lucide-react";
import { UserFullAPI } from "@/apis/user.api";
import { formatDate } from "@/lib/utils/formatDate";

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
  status: "PENDING" | "APPROVED" | "REJECTED"
) {
  if (!hasImage) return "missing" as const;
  if (status === "APPROVED") return "ok" as const;
  return "review" as const;
}

export function CustomerList() {
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
    currentStatus: "PENDING" | "APPROVED" | "REJECTED";
  } | null>(null);

  // Filters and sorting
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    role: "All",
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
        
        // Thử các cách truy cập khác nhau
        const usersData = response.data.items || response.data.data?.items || response.data.data || [];
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
        return [u.fullName, u.userName, u.phoneNumber, u.userEmail]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      });
    }

    // Role filter
    if (filters.role !== "All") {
      filtered = filtered.filter((u) => u.role === filters.role);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number, bVal: string | number;

      switch (sortState.field) {
        case "fullName":
          aVal = (a.fullName || "").toLowerCase();
          bVal = (b.fullName || "").toLowerCase();
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case "role":
          aVal = a.role;
          bVal = b.role;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [query, filters, sortState, users]);

  const allVisibleSelected =
    rows.length > 0 && rows.every((r) => selected[r.id]);
  const someVisibleSelected =
    rows.some((r) => selected[r.id]) && !allVisibleSelected;

  const toggleAllVisible = (checked: boolean) => {
    const next: SelectionMap = { ...selected };
    rows.forEach((r) => {
      next[r.id] = checked;
    });
    setSelected(next);
  };

  const clearFilters = () => {
    setQuery("");
    setFilters({
      role: "All",
    });
    setSortState({ field: "fullName", direction: "asc" });
  };

  const hasActiveFilters =
    query || Object.values(filters).some((v) => v !== "All");

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

  const showDocumentColumns = filters.role === "USER";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Enhanced Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Search and Bulk Actions Row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm nhanh (tên / user / phone / email)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-[280px]"
            />
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="role-filter"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Role:
            </Label>
            <Select
              value={filters.role}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, role: v }))
              }
            >
              <SelectTrigger id="role-filter" className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="STAFF">STAFF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by Filter */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <Label
              htmlFor="sort-filter"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Sort by:
            </Label>
            <Select
              value={`${sortState.field}-${sortState.direction}`}
              onValueChange={(v) => {
                const [field, direction] = v.split("-");
                setSortState({ field, direction: direction as "asc" | "desc" });
              }}
            >
              <SelectTrigger id="sort-filter" className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullName-asc">Name A→Z</SelectItem>
                <SelectItem value="fullName-desc">Name Z→A</SelectItem>
                <SelectItem value="role-asc">Role A→Z</SelectItem>
                <SelectItem value="role-desc">Role Z→A</SelectItem>
                <SelectItem value="createdAt-desc">Created (newest)</SelectItem>
                <SelectItem value="createdAt-asc">Created (oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* User List Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  aria-label="Select all"
                  checked={allVisibleSelected}
                  onCheckedChange={(v) => toggleAllVisible(Boolean(v))}
                  data-state={someVisibleSelected ? "indeterminate" : undefined}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Phone / Email</TableHead>
              <TableHead>Role</TableHead>
              {showDocumentColumns && <TableHead>Docs</TableHead>}
              {showDocumentColumns && <TableHead>Verify</TableHead>}
              <TableHead>Created</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
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
                          alt={u.fullName || "User"}
                          className="size-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium leading-tight">
                            {u.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {u.userName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Phone / Email */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{u.phoneNumber || "—"}</span>
                        <span className="text-xs text-muted-foreground">
                          {u.userEmail || "—"}
                        </span>
                      </div>
                    </TableCell>
                    {/* Role */}
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
                        {u.role}
                      </Badge>
                    </TableCell>
                    {/* Docs - Only show for USER role */}
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
                                  <span className="text-xs">Front</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Front:{" "}
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
                                  <span className="text-xs">Back</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Back:{" "}
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
                    {/* Verification - Only show for USER role */}
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
                                  Verify
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">No Document</Badge>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {/* Created */}
                    <TableCell>{formatDate(u.createdAt)}</TableCell>
                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          {showDocumentColumns && document && (
                            <DropdownMenuItem
                              onClick={() => handleDocumentVerification(u)}
                            >
                              Verify Document
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Audit log</DropdownMenuItem>
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
                                    <Badge variant="outline">{u.role}</Badge>
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Verified:
                                  </span>
                                  <span className="ml-2">
                                    <Badge
                                      variant={
                                        u.isVerify ? "default" : "secondary"
                                      }
                                    >
                                      {u.isVerify ? "Yes" : "No"}
                                    </Badge>
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Tạo lúc:
                                  </span>
                                  <span className="ml-2">
                                    {formatDate(u.createdAt)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">
                                    Cập nhật:
                                  </span>
                                  <span className="ml-2">
                                    {formatDate(u.updatedAt)}
                                  </span>
                                </div>
                                {u.createdBy && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Tạo bởi:
                                    </span>
                                    <span className="ml-2">{u.createdBy}</span>
                                  </div>
                                )}
                                {u.updatedBy && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Cập nhật bởi:
                                    </span>
                                    <span className="ml-2">{u.updatedBy}</span>
                                  </div>
                                )}
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
                                          {document.countryCode || "—"}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-sm text-muted-foreground">
                                          Số GPLX:
                                        </span>
                                        <div className="text-sm">
                                          {document.numberMasked || "—"}
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
                                                      u.fullName,
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
                                                      u.fullName,
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

                                    {document.verifiedBy && (
                                      <div className="text-sm">
                                        <span className="text-muted-foreground">
                                          Xác thực bởi:
                                        </span>
                                        <span className="ml-2">
                                          {document.verifiedBy}
                                        </span>
                                      </div>
                                    )}
                                    {document.verifiedAt && (
                                      <div className="text-sm">
                                        <span className="text-muted-foreground">
                                          Ngày xác thực:
                                        </span>
                                        <span className="ml-2">
                                          {formatDate(document.verifiedAt)}
                                        </span>
                                      </div>
                                    )}
                                    {document.note && (
                                      <div className="text-sm">
                                        <span className="text-muted-foreground">
                                          Ghi chú:
                                        </span>
                                        <span className="ml-2">
                                          {document.note}
                                        </span>
                                      </div>
                                    )}
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

      {/* Image Modal */}
      <Dialog
        open={!!imageModalOpen}
        onOpenChange={() => setImageModalOpen(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{imageModalOpen?.title}</DialogTitle>
          </DialogHeader>
          {imageModalOpen && (
            <div className="space-y-4">
              <img
                src={imageModalOpen.url}
                alt={imageModalOpen.title}
                className="w-full max-h-[400px] object-contain rounded border"
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => window.open(imageModalOpen.url, "_blank")}
                >
                  <ExternalLink className="size-4 mr-2" />
                  Mở trong tab mới
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Verification Modal */}
      <Dialog
        open={!!documentDialog.user}
        onOpenChange={() =>
          setDocumentDialog({ user: null, document: null, action: "approve" })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xác thực tài liệu</DialogTitle>
          </DialogHeader>

          {documentDialog.user && documentDialog.document && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(documentDialog.user.fullName || "User")}`}
                  alt={documentDialog.user.fullName || "User"}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">
                    {documentDialog.user.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {documentDialog.user.userName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Trạng thái hiện tại:
                    </span>
                    <Badge
                      variant={
                        documentDialog.document.status === "APPROVED"
                          ? "default"
                          : documentDialog.document.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {documentDialog.document.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Selection */}
              <div className="space-y-2">
                <Label className="text-sm">Chọn hành động</Label>
                <RadioGroup
                  value={documentDialog.action}
                  onValueChange={(v: "approve" | "reject") =>
                    setDocumentDialog({ ...documentDialog, action: v })
                  }
                  className="grid gap-2"
                >
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <RadioGroupItem value="approve" id="r-approve" />
                    <Label htmlFor="r-approve">Approve</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <RadioGroupItem value="reject" id="r-reject" />
                    <Label htmlFor="r-reject">Reject</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm">Ghi chú</Label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Nhập ghi chú..."
                  className="w-full min-h-[80px] p-3 border rounded-md resize-none"
                />
              </div>

              {/* Footer */}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setDocumentDialog({
                      user: null,
                      document: null,
                      action: "approve",
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDocumentVerification}
                  variant={
                    documentDialog.action === "reject"
                      ? "destructive"
                      : "default"
                  }
                >
                  {documentDialog.action === "approve" ? "Approve" : "Reject"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={!!statusChangeDialog}
        onOpenChange={() => setStatusChangeDialog(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
          </DialogHeader>

          {statusChangeDialog && statusChangeDialog.user && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(statusChangeDialog.user.fullName || "User")}`}
                  alt={statusChangeDialog.user.fullName || "User"}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">
                    {statusChangeDialog.user.fullName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {statusChangeDialog.user.userName}
                  </p>
                </div>
              </div>

              {/* Status Change Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">
                    Trạng thái hiện tại:
                  </span>
                  <Badge
                    variant={
                      statusChangeDialog.currentStatus === "APPROVED"
                        ? "default"
                        : statusChangeDialog.currentStatus === "REJECTED"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {statusChangeDialog.currentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Trạng thái mới:</span>
                  <Badge
                    variant={
                      statusChangeDialog.newStatus === "APPROVED"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {statusChangeDialog.newStatus}
                  </Badge>
                </div>
              </div>

              {/* Warning Message */}
              <div className="p-3 rounded-lg border bg-amber-50 text-amber-800">
                <p className="text-sm">
                  {statusChangeDialog.newStatus === "APPROVED"
                    ? "Tài liệu sẽ được duyệt và người dùng có thể sử dụng dịch vụ."
                    : "Tài liệu sẽ bị từ chối và có thể ảnh hưởng đến khả năng sử dụng dịch vụ của người dùng."}
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Ghi chú (tùy chọn)
                </Label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Nhập ghi chú cho việc thay đổi trạng thái..."
                  className="w-full min-h-[80px] p-3 border rounded-md resize-none text-sm"
                />
              </div>

              {/* Action Buttons */}
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusChangeDialog(null);
                    setVerificationNotes("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={confirmStatusChange}
                  variant={
                    statusChangeDialog.newStatus === "APPROVED"
                      ? "default"
                      : "destructive"
                  }
                >
                  {statusChangeDialog.newStatus === "APPROVED"
                    ? "Duyệt tài liệu"
                    : "Từ chối tài liệu"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
