
import { useMemo, useState, useEffect } from "react";
import * as React from "react";
import { mockCustomers, type Customer } from "@/mockdata/mock-admin";
import type { VerificationAudit } from "@/mockdata/mock-admin";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  ShieldCheck,
  AlertTriangle,
  Minus,
  Filter,
  ArrowUpDown,
  ExternalLink,
  FileText,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    const date = new Date(iso);
    const dateStr = date.toLocaleDateString("vi-VN");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${dateStr} ${hours}:${minutes}`;
  } catch {
    return iso;
  }
}

type SelectionMap = Record<string, boolean>;

type FilterState = {
  verificationStatus: string;
  riskLevel: string;
  active: string;
  docs: string;
  dateRange: string;
};

type SortState = {
  field: string;
  direction: "asc" | "desc";
};

function getDocStatus(hasImage: boolean | undefined, verificationStatus: Customer["verificationStatus"]) {
  if (!hasImage) return "missing" as const;
  if (verificationStatus === "Verified") return "ok" as const;
  return "review" as const;
}

type VerificationChecklist = {
  hasValidImages: boolean;
  nameMatches: boolean;
  dobMatches: boolean;
  gplxValid: boolean;
  accountActive: boolean;
  notRejected: boolean;
  riskAcceptable: boolean;
  noRecentViolations: boolean;
  hasContactInfo: boolean;
};

function checkVerificationRequirements(customer: Customer): VerificationChecklist {
  const hasCCCD = Boolean(customer.cccdImageUrl);
  const hasGPLX = Boolean(customer.gplxImageUrl);

  return {
    hasValidImages: hasCCCD && hasGPLX,
    nameMatches: true, // Simplified - would check OCR results
    dobMatches: true, // Simplified - would check OCR results
    gplxValid: true, // Simplified - would check expiry date
    accountActive: customer.isActive,
    notRejected: customer.verificationStatus !== "Rejected",
    riskAcceptable: customer.riskLevel !== "High",
    noRecentViolations: customer.totalViolations === 0,
    hasContactInfo: Boolean(customer.phoneNumber || customer.email),
  };
}

function canVerify(customer: Customer): { canVerify: boolean; missingRequirements: string[] } {
  const checklist = checkVerificationRequirements(customer);
  const missingRequirements: string[] = [];

  if (!checklist.hasValidImages) missingRequirements.push("Thiếu ảnh CCCD hoặc GPLX");
  if (!checklist.nameMatches) missingRequirements.push("Tên không khớp với giấy tờ");
  if (!checklist.dobMatches) missingRequirements.push("Ngày sinh không khớp");
  if (!checklist.gplxValid) missingRequirements.push("GPLX đã hết hạn");
  if (!checklist.accountActive) missingRequirements.push("Tài khoản bị khóa");
  // Loại bỏ điều kiện notRejected để cho phép chuyển từ Rejected sang Verified

  return {
    canVerify: missingRequirements.length === 0,
    missingRequirements
  };
}

function parseUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") || "",
    verificationStatus: params.get("verificationStatus") || "All",
    riskLevel: params.get("riskLevel") || "All",
    active: params.get("active") || "All",
    docs: params.get("docs") || "All",
    dateRange: params.get("dateRange") || "All",
    sortField: params.get("sortField") || "fullName",
    sortDirection: (params.get("sortDirection") as "asc" | "desc") || "asc",
  };
}

function updateUrlState(state: Record<string, string | number | boolean>) {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (value && value !== "All" && value !== "") {
      params.set(key, String(value));
    }
  });
  const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  window.history.replaceState({}, "", newUrl);
}

export function CustomerList() {
  const { user: currentUser } = useAuthStore();
  const [selected, setSelected] = useState<SelectionMap>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState<{ url: string; title: string } | null>(null);
  const [verificationDialog, setVerificationDialog] = useState<{
    customer: Customer | null;
    action: "verify" | "pending" | "reject";
  }>({ customer: null, action: "verify" });
  const [verifTarget, setVerifTarget] = useState<"Pending" | "Verified" | "Rejected">("Pending");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [rejectEvidence, setRejectEvidence] = useState("");
  const [rejectLockAccount, setRejectLockAccount] = useState(false);
  const [quickReasons] = useState<string[]>([
    "Cần rà soát lại ảnh",
    "Thông tin không khớp",
    "Nghi ngờ giả mạo",
    "Khác (ghi rõ)",
  ]);
  const [data, setData] = useState<Customer[]>(mockCustomers);
  // Keep auditMap for future Audit Log view
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [auditMap, setAuditMap] = useState<Record<string, VerificationAudit[]>>({});
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    action: "export" | "reject" | "lock" | "assign" | null;
    selectedCustomers: Customer[];
  }>({ action: null, selectedCustomers: [] });
  const [bulkActionNotes, setBulkActionNotes] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [activeTogglePopover, setActiveTogglePopover] = useState<{
    customerId: string;
    customerName: string;
    currentStatus: boolean;
    newStatus: boolean;
  } | null>(null);

  // Initialize state from URL
  const urlState = parseUrlState();
  const [query, setQuery] = useState(urlState.query);
  const [filters, setFilters] = useState<FilterState>({
    verificationStatus: urlState.verificationStatus,
    riskLevel: urlState.riskLevel,
    active: urlState.active,
    docs: urlState.docs,
    dateRange: urlState.dateRange,
  });
  const [sortState, setSortState] = useState<SortState>({
    field: urlState.sortField,
    direction: urlState.sortDirection,
  });

  // Update URL when state changes
  useEffect(() => {
    updateUrlState({
      q: query,
      verificationStatus: filters.verificationStatus,
      riskLevel: filters.riskLevel,
      active: filters.active,
      docs: filters.docs,
      dateRange: filters.dateRange,
      sortField: sortState.field,
      sortDirection: sortState.direction,
    });
  }, [query, filters, sortState]);

  const rows = useMemo(() => {
    let filtered = data;

    // Text search
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((c) => {
        return [c.fullName, c.userName, c.phoneNumber, c.email]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      });
    }

    // Verification status filter
    if (filters.verificationStatus !== "All") {
      filtered = filtered.filter((c) => c.verificationStatus === filters.verificationStatus);
    }

    // Risk level filter
    if (filters.riskLevel !== "All") {
      filtered = filtered.filter((c) => c.riskLevel === filters.riskLevel);
    }

    // Active filter
    if (filters.active !== "All") {
      const isActive = filters.active === "Active";
      filtered = filtered.filter((c) => c.isActive === isActive);
    }

    // Docs filter
    if (filters.docs !== "All") {
      filtered = filtered.filter((c) => {
        const hasCCCD = Boolean(c.cccdImageUrl);
        const hasGPLX = Boolean(c.gplxImageUrl);
        switch (filters.docs) {
          case "Has CCCD":
            return hasCCCD;
          case "Has GPLX":
            return hasGPLX;
          case "Missing any":
            return !hasCCCD || !hasGPLX;
          case "Complete":
            return hasCCCD && hasGPLX;
          default:
            return true;
        }
      });
    }

    // Date range filter (simplified - using createdAt)
    if (filters.dateRange !== "All") {
      const now = new Date();
      const daysAgo = filters.dateRange === "Last 7 days" ? 7 :
        filters.dateRange === "Last 30 days" ? 30 :
          filters.dateRange === "Last 90 days" ? 90 : 0;

      if (daysAgo > 0) {
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((c) => new Date(c.createdAt) >= cutoffDate);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number, bVal: string | number;

      switch (sortState.field) {
        case "fullName":
          aVal = a.fullName.toLowerCase();
          bVal = b.fullName.toLowerCase();
          break;
        case "lastRentalDate":
          aVal = a.lastRentalDate ? new Date(a.lastRentalDate).getTime() : 0;
          bVal = b.lastRentalDate ? new Date(b.lastRentalDate).getTime() : 0;
          break;
        case "totalViolations":
          aVal = a.totalViolations;
          bVal = b.totalViolations;
          break;
        case "totalRentals":
          aVal = a.totalRentals;
          bVal = b.totalRentals;
          break;
        case "createdAt":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [query, filters, sortState, data]);

  const allVisibleSelected = rows.length > 0 && rows.every((r) => selected[r.id]);
  const someVisibleSelected = rows.some((r) => selected[r.id]) && !allVisibleSelected;

  const toggleAllVisible = (checked: boolean) => {
    const next: SelectionMap = { ...selected };
    rows.forEach((r) => {
      next[r.id] = checked;
    });
    setSelected(next);
  };

  const countSelected = Object.values(selected).filter(Boolean).length;

  const clearFilters = () => {
    setQuery("");
    setFilters({
      verificationStatus: "All",
      riskLevel: "All",
      active: "All",
      docs: "All",
      dateRange: "All",
    });
    setSortState({ field: "fullName", direction: "asc" });
  };

  const hasActiveFilters = query || Object.values(filters).some(v => v !== "All");

  const handleVerificationToggle = (customer: Customer) => {
    setVerificationDialog({ customer, action: "verify" });
    // Set initial target to the opposite of current status
    if (customer.verificationStatus === "Pending") {
      setVerifTarget("Verified"); // Default to Verified when coming from Pending
    } else if (customer.verificationStatus === "Verified") {
      setVerifTarget("Rejected"); // Only can switch to Rejected when coming from Verified
    } else if (customer.verificationStatus === "Rejected") {
      setVerifTarget("Verified"); // Only can switch to Verified when coming from Rejected
    }
    setVerificationNotes("");
    setRejectEvidence("");
    setRejectLockAccount(false);
  };

  const handleActiveToggle = (customer: Customer, newStatus: boolean) => {
    setActiveTogglePopover({
      customerId: customer.id,
      customerName: customer.fullName,
      currentStatus: customer.isActive,
      newStatus: newStatus,
    });
  };

  const confirmActiveToggle = () => {
    if (!activeTogglePopover) return;

    const { customerId, newStatus } = activeTogglePopover;

    // Update customer active status
    setData((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          isActive: newStatus,
        };
      })
    );

    // Close popover
    setActiveTogglePopover(null);
  };

  const confirmVerification = () => {
    if (!verificationDialog.customer) return;
    const customer = verificationDialog.customer;
    const oldStatus = customer.verificationStatus;
    const newStatus = verifTarget;
    const now = new Date().toISOString();

    // Validate transitions
    let isValid = true;
    const errors: string[] = [];

    if (oldStatus === "Pending" && newStatus === "Verified") {
      const { canVerify: ok, missingRequirements } = canVerify(customer);
      if (!ok) {
        isValid = false;
        errors.push(...missingRequirements);
      }
    }
    if (oldStatus === "Pending" && newStatus === "Rejected") {
      if (verificationNotes.trim().length < 10) {
        isValid = false;
        errors.push("Reason tối thiểu 10 ký tự");
      }
    }
    if (oldStatus === "Verified" && newStatus === "Rejected") {
      if (verificationNotes.trim().length < 10 || !rejectEvidence.trim()) {
        isValid = false;
        errors.push("Cần reason >= 10 ký tự và evidence URLs");
      }
    }
    if (oldStatus === "Rejected" && newStatus === "Verified") {
      // Cho phép chuyển từ Rejected sang Verified nếu có đủ điều kiện
      const { canVerify: ok, missingRequirements } = canVerify(customer);
      if (!ok) {
        isValid = false;
        errors.push(...missingRequirements);
      }
    }
    if (oldStatus === newStatus) {
      isValid = false;
      errors.push("Trạng thái không thay đổi");
    }

    if (!isValid) {
      console.warn("Validation failed:", errors);
      return;
    }

    // Apply update to local data
    setData((prev) =>
      prev.map((c) => {
        if (c.id !== customer.id) return c;
        // Removed Pending handling as it's no longer allowed
        if (newStatus === "Verified") {
          return {
            ...c,
            verificationStatus: "Verified",
            verifiedBy: currentUser?.userName || currentUser?.fullName || "Unknown",
            verifiedAt: now,
            rejectedAt: undefined, // Clear rejected date when verified
          };
        }
        // Rejected
        return {
          ...c,
          verificationStatus: "Rejected",
          verifiedBy: currentUser?.userName || currentUser?.fullName || "Unknown",
          rejectedAt: now,
          isActive: rejectLockAccount ? false : c.isActive,
        };
      })
    );

    // Record audit
    setAuditMap((prev) => {
      const audits = { ...prev };
      const list = audits[customer.id] ? [...audits[customer.id]] : [];
      const currentUserInfo = currentUser?.userName || currentUser?.fullName || "Unknown";

      if (oldStatus === "Pending" && newStatus === "Verified") {
        list.push({
          at: now,
          by: currentUserInfo,
          from: oldStatus,
          to: "Verified",
          action: "verify",
          note: verificationNotes || undefined,
        } as VerificationAudit);
      } else if (oldStatus === "Pending" && newStatus === "Rejected") {
        list.push({
          at: now,
          by: currentUserInfo,
          from: oldStatus,
          to: "Rejected",
          action: "reject",
          reason: verificationNotes,
          evidenceLinks: rejectEvidence
            ? rejectEvidence.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
        } as VerificationAudit);
      } else if (oldStatus === "Verified" && newStatus === "Rejected") {
        list.push({
          at: now,
          by: currentUserInfo,
          from: oldStatus,
          to: "Rejected",
          action: "reject",
          reason: verificationNotes,
          evidenceLinks: rejectEvidence
            ? rejectEvidence.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
        } as VerificationAudit);
      } else if (oldStatus === "Rejected" && newStatus === "Verified") {
        list.push({
          at: now,
          by: currentUserInfo,
          from: oldStatus,
          to: "Verified",
          action: "verify_after_reject",
          note: verificationNotes || undefined,
        } as VerificationAudit);
      }
      audits[customer.id] = list;
      return audits;
    });

    // Close dialog and reset
    setVerificationDialog({ customer: null, action: "verify" });
    setVerificationNotes("");
    setRejectEvidence("");
    setRejectLockAccount(false);
  };

  const handleBulkAction = (action: "export" | "reject" | "lock" | "assign") => {
    const selectedCustomers = rows.filter(c => selected[c.id]);
    if (selectedCustomers.length === 0) return;

    setBulkActionDialog({ action, selectedCustomers });
  };

  const confirmBulkAction = () => {
    if (!bulkActionDialog.action || bulkActionDialog.selectedCustomers.length === 0) return;

    const { action, selectedCustomers } = bulkActionDialog;

    switch (action) {
      case "export":
        exportToCSV(selectedCustomers);
        break;
      case "reject":
        console.log("Mark rejected:", selectedCustomers.map(c => c.id), { reason: bulkActionNotes });
        break;
      case "lock":
        console.log("Lock accounts:", selectedCustomers.map(c => c.id), { reason: bulkActionNotes });
        break;
      case "assign":
        console.log("Assign reviewer:", selectedCustomers.map(c => c.id), { reviewer: selectedReviewer });
        break;
    }

    // Close dialog and reset state
    setBulkActionDialog({ action: null, selectedCustomers: [] });
    setBulkActionNotes("");
    setSelectedReviewer("");
    setSelected({}); // Clear selection
  };

  const exportToCSV = (customers: Customer[]) => {
    const headers = [
      "ID", "Full Name", "Username", "Email", "Phone", "Gender", "DOB", "Address",
      "CCCD", "GPLX", "Verification Status", "Risk Level", "Total Rentals",
      "Total Violations", "Last Rental Date", "Is Active", "Created At"
    ];

    const csvContent = [
      headers.join(","),
      ...customers.map(c => [
        c.id,
        `"${c.fullName}"`,
        c.userName,
        c.email || "",
        c.phoneNumber,
        c.gender || "",
        c.dob || "",
        `"${c.address || ""}"`,
        c.cccd || "",
        c.gplx || "",
        c.verificationStatus,
        c.riskLevel || "",
        c.totalRentals,
        c.totalViolations,
        c.lastRentalDate || "",
        c.isActive,
        c.createdAt
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={countSelected === 0}>
                  Bulk actions ({countSelected})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Áp dụng cho mục chọn</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("export")}>Export CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("reject")}>Mark Rejected…</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("lock")}>Lock accounts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("assign")}>Assign reviewer…</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

          {/* Verification Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="verification-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Verification:
            </Label>
            <Select value={filters.verificationStatus} onValueChange={(v) => setFilters(prev => ({ ...prev, verificationStatus: v }))}>
              <SelectTrigger id="verification-filter" className="w-[140px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="risk-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Risk Level:
            </Label>
            <Select value={filters.riskLevel} onValueChange={(v) => setFilters(prev => ({ ...prev, riskLevel: v }))}>
              <SelectTrigger id="risk-filter" className="w-[120px]">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="active-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Status:
            </Label>
            <Select value={filters.active} onValueChange={(v) => setFilters(prev => ({ ...prev, active: v }))}>
              <SelectTrigger id="active-filter" className="w-[120px]">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="docs-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Documents:
            </Label>
            <Select value={filters.docs} onValueChange={(v) => setFilters(prev => ({ ...prev, docs: v }))}>
              <SelectTrigger id="docs-filter" className="w-[140px]">
                <SelectValue placeholder="Docs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Has CCCD">Has CCCD</SelectItem>
                <SelectItem value="Has GPLX">Has GPLX</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Missing any">Missing any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="date-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Date Range:
            </Label>
            <Select value={filters.dateRange} onValueChange={(v) => setFilters(prev => ({ ...prev, dateRange: v }))}>
              <SelectTrigger id="date-filter" className="w-[140px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                <SelectItem value="Last 90 days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort by Filter */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <Label htmlFor="sort-filter" className="text-sm text-muted-foreground whitespace-nowrap">
              Sort by:
            </Label>
            <Select value={`${sortState.field}-${sortState.direction}`} onValueChange={(v) => {
              const [field, direction] = v.split('-');
              setSortState({ field, direction: direction as "asc" | "desc" });
            }}>
              <SelectTrigger id="sort-filter" className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fullName-asc">Name A→Z</SelectItem>
                <SelectItem value="fullName-desc">Name Z→A</SelectItem>
                <SelectItem value="lastRentalDate-desc">Last rental (newest)</SelectItem>
                <SelectItem value="lastRentalDate-asc">Last rental (oldest)</SelectItem>
                <SelectItem value="totalViolations-desc">Violations (high)</SelectItem>
                <SelectItem value="totalViolations-asc">Violations (low)</SelectItem>
                <SelectItem value="totalRentals-desc">Rentals (high)</SelectItem>
                <SelectItem value="totalRentals-asc">Rentals (low)</SelectItem>
                <SelectItem value="createdAt-desc">Created (newest)</SelectItem>
                <SelectItem value="createdAt-asc">Created (oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Customer List Table*/}
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
              <TableHead>Customer</TableHead>
              <TableHead>Phone / Email</TableHead>
              <TableHead>Docs</TableHead>
              <TableHead>Verify</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Rentals</TableHead>
              <TableHead>Viol.</TableHead>
              <TableHead>Last rental</TableHead>
              <TableHead>Complaints</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => {
              const selectedRow = Boolean(selected[c.id]);
              const cccd = getDocStatus(Boolean(c.cccdImageUrl), c.verificationStatus);
              const gplx = getDocStatus(Boolean(c.gplxImageUrl), c.verificationStatus);
              return (
                <React.Fragment key={c.id}>
                  <TableRow
                    data-state={selectedRow ? "selected" : undefined}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                  >
                    <TableCell className="w-[40px]">
                      <Checkbox
                        aria-label={`Select ${c.fullName}`}
                        checked={selectedRow}
                        onCheckedChange={(v) =>
                          setSelected((s) => ({ ...s, [c.id]: Boolean(v) }))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={c.profilePicture || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(c.fullName)}
                          alt={c.fullName}
                          className="size-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium leading-tight">{c.fullName}</div>
                          <div className="text-xs text-muted-foreground">{c.userName}</div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Phone / Email */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{c.phoneNumber || "—"}</span>
                        <span className="text-xs text-muted-foreground">{c.email || "—"}</span>
                      </div>
                    </TableCell>
                    {/* Docs */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                {cccd === "ok" ? (
                                  <ShieldCheck className="text-emerald-500" />
                                ) : cccd === "review" ? (
                                  <AlertTriangle className="text-amber-500" />
                                ) : (
                                  <Minus className="text-muted-foreground" />
                                )}
                                <span className="text-xs">CCCD</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>CCCD: {cccd === "ok" ? "Đã xác thực" : cccd === "review" ? "Cần review" : "Thiếu"}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                {gplx === "ok" ? (
                                  <ShieldCheck className="text-emerald-500" />
                                ) : gplx === "review" ? (
                                  <AlertTriangle className="text-amber-500" />
                                ) : (
                                  <Minus className="text-muted-foreground" />
                                )}
                                <span className="text-xs">GPLX</span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>GPLX: {gplx === "ok" ? "Đã xác thực" : gplx === "review" ? "Cần review" : "Thiếu"}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    {/* Verification */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            c.verificationStatus === "Verified"
                              ? "default"
                              : c.verificationStatus === "Rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {c.verificationStatus}
                        </Badge>
                        {/* Chỉ hiển thị nút Verify khi có đủ ảnh CCCD và GPLX */}
                        {c.cccdImageUrl && c.gplxImageUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row expansion
                              handleVerificationToggle(c);
                            }}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    {/* Risk */}
                    <TableCell>
                      <Badge
                        variant={
                          c.riskLevel === "High"
                            ? "destructive"
                            : c.riskLevel === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {c.riskLevel || "—"}
                      </Badge>
                    </TableCell>
                    {/* Rentals */}
                    <TableCell>{c.totalRentals}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="underline decoration-dotted underline-offset-4 cursor-help">
                              {c.totalViolations}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {c.totalViolations > 0 ? "Xem chi tiết vi phạm gần nhất trong hồ sơ" : "Không có vi phạm"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {/* Last rental */}
                    <TableCell>{formatDate(c.lastRentalDate)}</TableCell>
                    {/* Complaints */}
                    <TableCell>
                      {c.complaints?.filter((cm) => cm.status === "Pending").length || 0}
                    </TableCell>
                    {/* Active */}
                    <TableCell>
                      <Popover
                        open={activeTogglePopover?.customerId === c.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setActiveTogglePopover(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Checkbox
                            aria-label="Active toggle"
                            checked={c.isActive}
                            onCheckedChange={(checked) => {
                              if (typeof checked === 'boolean') {
                                handleActiveToggle(c, checked);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="center">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={c.profilePicture || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(c.fullName)}
                                alt={c.fullName}
                                className="size-8 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-medium">{c.fullName}</h4>
                                <p className="text-sm text-muted-foreground">{c.userName}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm">
                                Bạn có chắc muốn {activeTogglePopover?.newStatus ? 'kích hoạt' : 'khóa'} tài khoản này?
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Trạng thái hiện tại:</span>
                                <Badge variant={c.isActive ? "default" : "secondary"}>
                                  {c.isActive ? "Đang hoạt động" : "Đã khóa"}
                                </Badge>
                                <span className="text-muted-foreground">→</span>
                                <Badge variant={activeTogglePopover?.newStatus ? "default" : "destructive"}>
                                  {activeTogglePopover?.newStatus ? "Đang hoạt động" : "Đã khóa"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveTogglePopover(null)}
                                className="flex-1"
                              >
                                Hủy
                              </Button>
                              <Button
                                variant={activeTogglePopover?.newStatus ? "default" : "destructive"}
                                size="sm"
                                onClick={confirmActiveToggle}
                                className="flex-1"
                              >
                                {activeTogglePopover?.newStatus ? 'Kích hoạt' : 'Khóa'}
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
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
                          <DropdownMenuItem>View</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Verify details</DropdownMenuItem>
                          {c.isActive ? (
                            <DropdownMenuItem>Ban</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Unban</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Audit log</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row Content */}
                  {expandedRow === c.id && (
                    <TableRow>
                      <TableCell colSpan={12} className="p-0">
                        <div className="border-t bg-muted/20 p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center gap-2">
                                <User className="size-4" />
                                Thông tin cơ bản
                              </h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Giới tính:</span>
                                  <span className="ml-2">{c.gender || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Ngày sinh:</span>
                                  <span className="ml-2">{formatDate(c.dob)}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Địa chỉ:</span>
                                  <span className="ml-2">{c.address || "—"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Tạo lúc:</span>
                                  <span className="ml-2">{formatDate(c.createdAt)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Cập nhật:</span>
                                  <span className="ml-2">{formatDate(c.updatedAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center gap-2">
                                <FileText className="size-4" />
                                Tài liệu
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {/* Top Row: Numbers */}
                                <div className="space-y-2">
                                  <span className="text-sm text-muted-foreground">Số CCCD:</span>
                                  <div className="text-sm text-muted-foreground">{c.cccd || "Không có"}</div>
                                </div>
                                <div className="space-y-2">
                                  <span className="text-sm text-muted-foreground">Số GPLX:</span>
                                  <div className="text-sm text-muted-foreground">{c.gplx || "Không có"}</div>
                                </div>

                                {/* Bottom Row: Images */}
                                <div className="space-y-2">
                                  <span className="text-sm text-muted-foreground">Ảnh CCCD:</span>
                                  {c.cccdImageUrl ? (
                                    <div className="relative group">
                                      <img
                                        src={c.cccdImageUrl}
                                        alt="CCCD"
                                        className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                        onClick={() => setImageModalOpen({ url: c.cccdImageUrl!, title: "CCCD - " + c.fullName })}
                                      />
                                      {/* Click to view indicator */}
                                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded border flex items-center justify-center pointer-events-none">
                                        <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <Eye className="size-3 text-gray-700" />
                                          <span className="text-xs font-medium text-gray-700">Click để xem</span>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-1 right-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(c.cccdImageUrl, '_blank');
                                        }}
                                      >
                                        <ExternalLink className="size-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="w-full h-20 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                                      Không có ảnh CCCD
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <span className="text-sm text-muted-foreground">Ảnh GPLX:</span>
                                  {c.gplxImageUrl ? (
                                    <div className="relative group">
                                      <img
                                        src={c.gplxImageUrl}
                                        alt="GPLX"
                                        className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                        onClick={() => setImageModalOpen({ url: c.gplxImageUrl!, title: "GPLX - " + c.fullName })}
                                      />
                                      {/* Click to view indicator */}
                                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded border flex items-center justify-center pointer-events-none">
                                        <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <Eye className="size-3 text-gray-700" />
                                          <span className="text-xs font-medium text-gray-700">Click để xem</span>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-1 right-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(c.gplxImageUrl, '_blank');
                                        }}
                                      >
                                        <ExternalLink className="size-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="w-full h-20 rounded border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                                      Không có ảnh GPLX
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Verification Info */}
                            <div className="space-y-4">
                              <h4 className="font-semibold flex items-center gap-2">
                                <ShieldCheck className="size-4" />
                                Xác thực
                              </h4>
                              <div className="space-y-2 text-sm">
                                {c.verificationStatus === "Verified" && c.verifiedBy && (
                                  <>
                                    <div>
                                      <span className="text-muted-foreground">Xác thực bởi:</span>
                                      <span className="ml-2">{c.verifiedBy}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Ngày xác thực:</span>
                                      <span className="ml-2">{formatDate(c.verifiedAt)}</span>
                                    </div>
                                  </>
                                )}
                                {c.verificationStatus === "Rejected" && c.verifiedBy && (
                                  <>
                                    <div>
                                      <span className="text-muted-foreground">Từ chối bởi:</span>
                                      <span className="ml-2">{c.verifiedBy}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Ngày từ chối:</span>
                                      <span className="ml-2">{formatDate(c.rejectedAt)}</span>
                                    </div>
                                  </>
                                )}
                                {c.verificationStatus === "Pending" && (
                                  <div className="text-muted-foreground">
                                    Đang chờ xác thực
                                  </div>
                                )}
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

      {/* Image Modal */}
      <Dialog open={!!imageModalOpen} onOpenChange={() => setImageModalOpen(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{imageModalOpen?.title}</DialogTitle>
          </DialogHeader>
          {imageModalOpen && (
            <div className="space-y-4">
              <img
                src={imageModalOpen.url}
                alt={imageModalOpen.title}
                className="w-full max-h-[600px] object-contain rounded border"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => window.open(imageModalOpen.url, '_blank')}>
                  <ExternalLink className="size-4 mr-2" />
                  Mở trong tab mới
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unified Verification Modal */}
      <Dialog open={!!verificationDialog.customer} onOpenChange={() => setVerificationDialog({ customer: null, action: "verify" })}>
        <DialogContent className="max-w-2xls h-[90vh]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái xác thực</DialogTitle>
          </DialogHeader>

          {verificationDialog.customer && (
            <div className="space-y-6 h-full overflow-y-auto">
              {/* Customer Info - Sticky Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-4">
                <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                  <img
                    src={verificationDialog.customer.profilePicture || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(verificationDialog.customer.fullName)}
                    alt={verificationDialog.customer.fullName}
                    className="size-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{verificationDialog.customer.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{verificationDialog.customer.userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Trạng thái hiện tại:</span>
                      <Badge
                        variant={
                          verificationDialog.customer.verificationStatus === "Verified"
                            ? "default"
                            : verificationDialog.customer.verificationStatus === "Rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {verificationDialog.customer.verificationStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inline alert for reject from Verified */}
              {(verificationDialog.customer.verificationStatus === "Verified" && verifTarget === "Rejected") && (
                <div className="p-3 rounded-md border bg-red-50 text-red-700 text-sm">
                  Hành động ảnh hưởng đến khả năng đặt xe của khách hàng.
                </div>
              )}


              {/* Radio group for target status */}
              <div className="space-y-2">
                <Label className="text-sm">Chọn trạng thái mới</Label>
                <RadioGroup value={verifTarget} onValueChange={(v: "Pending" | "Verified" | "Rejected") => setVerifTarget(v)} className="grid gap-2" style={{ gridTemplateColumns: "1fr" }}>
                  {verificationDialog.customer.verificationStatus === "Pending" && (
                    <>
                      <div className="flex items-center space-x-2 p-2 border rounded">
                        <RadioGroupItem value="Verified" id="r-verified" />
                        <Label htmlFor="r-verified">Verified</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 border rounded">
                        <RadioGroupItem value="Rejected" id="r-rejected" />
                        <Label htmlFor="r-rejected">Rejected</Label>
                      </div>
                    </>
                  )}
                  {verificationDialog.customer.verificationStatus === "Verified" && (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <RadioGroupItem value="Rejected" id="r-rejected" />
                      <Label htmlFor="r-rejected">Rejected</Label>
                    </div>
                  )}
                  {verificationDialog.customer.verificationStatus === "Rejected" && (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <RadioGroupItem value="Verified" id="r-verified" />
                      <Label htmlFor="r-verified">Verified</Label>
                    </div>
                  )}
                </RadioGroup>
              </div>

              {/* Conditional panels */}
              {verifTarget === "Verified" && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="size-4" />
                    {verificationDialog.customer.verificationStatus === "Rejected" ? "Checklist điều kiện để xác thực lại (tất cả cần đạt)" : "Checklist điều kiện (tất cả cần đạt)"}
                  </h4>
                  {(() => {
                    const checklist = checkVerificationRequirements(verificationDialog.customer);
                    const { missingRequirements, canVerify: ok } = canVerify(verificationDialog.customer);
                    return (
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 p-2 rounded ${checklist.hasValidImages ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {checklist.hasValidImages ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                          <span className="text-sm">Có ảnh CCCD và GPLX hợp lệ</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${checklist.nameMatches ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {checklist.nameMatches ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                          <span className="text-sm">Tên/Ngày sinh khớp hồ sơ</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${checklist.gplxValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {checklist.gplxValid ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                          <span className="text-sm">GPLX còn hiệu lực</span>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded ${checklist.accountActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {checklist.accountActive ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
                          <span className="text-sm">Tài khoản đang Active</span>
                        </div>
                        {!ok && (
                          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded">
                            <div className="flex items-center gap-2 text-amber-700">
                              <AlertCircle className="size-4" />
                              {verificationDialog.customer.verificationStatus === "Rejected" ? "Cần khắc phục để xác thực lại:" : "Cần khắc phục:"}
                            </div>
                            <ul className="mt-1 text-sm text-amber-700 list-disc ml-5">
                              {missingRequirements.map((m, i) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}


              {verifTarget === "Rejected" && (
                <div className="space-y-3">
                  <div className="p-3 rounded-md border bg-red-50 text-red-700 text-sm">
                    {verificationDialog.customer.verificationStatus === "Verified"
                      ? "Bạn sắp từ chối một hồ sơ đã xác thực. Hãy nêu rõ lý do và đính kèm bằng chứng."
                      : "Từ chối hồ sơ đang Pending. Hãy nêu rõ lý do và đính kèm bằng chứng (khuyến nghị)."}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        className="px-2 py-1 rounded-md border text-xs hover:bg-accent"
                        onClick={() => setVerificationNotes((prev) => (prev ? prev + "; " + reason : reason))}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Lý do *</Label>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Nhập lý do (tối thiểu 10 ký tự)"
                      className="w-full min-h-[90px] p-3 border rounded-md resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Evidence URLs (mỗi link cách nhau bởi dấu phẩy)</Label>
                    <input
                      value={rejectEvidence}
                      onChange={(e) => setRejectEvidence(e.target.value)}
                      placeholder="https://..., https://..."
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={rejectLockAccount}
                      onChange={(e) => setRejectLockAccount(e.target.checked)}
                    />
                    Lock account
                  </label>
                </div>
              )}

              {/* Footer - Sticky Bottom */}
              <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-4">
                <DialogFooter>
                  <Button variant="outline" onClick={() => setVerificationDialog({ customer: null, action: "verify" })}>
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmVerification}
                    variant="default"
                    disabled={(() => {
                      const oldStatus = verificationDialog.customer.verificationStatus;
                      if (oldStatus === verifTarget) return true;

                      if (verifTarget === "Verified") {
                        return !canVerify(verificationDialog.customer).canVerify;
                      }
                      // Rejected
                      if (oldStatus === "Verified") {
                        return verificationNotes.trim().length < 10 || !rejectEvidence.trim();
                      }
                      return verificationNotes.trim().length < 10;
                    })()}
                  >
                    Update
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={!!bulkActionDialog.action} onOpenChange={() => setBulkActionDialog({ action: null, selectedCustomers: [] })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {bulkActionDialog.action === "export" && "Export CSV"}
              {bulkActionDialog.action === "reject" && "Mark as Rejected"}
              {bulkActionDialog.action === "lock" && "Lock Accounts"}
              {bulkActionDialog.action === "assign" && "Assign Reviewer"}
            </DialogTitle>
          </DialogHeader>

          {bulkActionDialog.action && (
            <div className="space-y-4">
              {/* Selected Customers Info */}
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Áp dụng cho {bulkActionDialog.selectedCustomers.length} khách hàng:
                </p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {bulkActionDialog.selectedCustomers.map(customer => (
                    <div key={customer.id} className="text-sm text-muted-foreground">
                      • {customer.fullName} ({customer.userName})
                    </div>
                  ))}
                </div>
              </div>

              {/* Action-specific content */}
              {bulkActionDialog.action === "export" && (
                <div className="text-sm text-muted-foreground">
                  Dữ liệu sẽ được xuất ra file CSV với tất cả thông tin khách hàng đã chọn.
                </div>
              )}

              {(bulkActionDialog.action === "reject" || bulkActionDialog.action === "lock") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Lý do {bulkActionDialog.action === "reject" ? "từ chối" : "khóa tài khoản"} *
                  </label>
                  <textarea
                    value={bulkActionNotes}
                    onChange={(e) => setBulkActionNotes(e.target.value)}
                    placeholder="Nhập lý do..."
                    className="w-full min-h-[80px] p-3 border rounded-md resize-none"
                    required
                  />
                </div>
              )}

              {bulkActionDialog.action === "assign" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chọn reviewer *</label>
                  <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn reviewer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADM-001">Admin 001 - Nguyễn Văn A</SelectItem>
                      <SelectItem value="ADM-002">Admin 002 - Trần Thị B</SelectItem>
                      <SelectItem value="STF-003">Staff 003 - Lê Văn C</SelectItem>
                      <SelectItem value="STF-004">Staff 004 - Phạm Thị D</SelectItem>
                    </SelectContent>
                  </Select>
                  <textarea
                    value={bulkActionNotes}
                    onChange={(e) => setBulkActionNotes(e.target.value)}
                    placeholder="Ghi chú cho reviewer..."
                    className="w-full min-h-[60px] p-3 border rounded-md resize-none"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkActionDialog({ action: null, selectedCustomers: [] })}>
                  Hủy
                </Button>
                <Button
                  onClick={confirmBulkAction}
                  variant={bulkActionDialog.action === "reject" || bulkActionDialog.action === "lock" ? "destructive" : "default"}
                  disabled={
                    (bulkActionDialog.action === "reject" || bulkActionDialog.action === "lock") && !bulkActionNotes.trim() ||
                    bulkActionDialog.action === "assign" && !selectedReviewer
                  }
                >
                  {bulkActionDialog.action === "export" && "Export CSV"}
                  {bulkActionDialog.action === "reject" && "Mark Rejected"}
                  {bulkActionDialog.action === "lock" && "Lock Accounts"}
                  {bulkActionDialog.action === "assign" && "Assign Reviewer"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
