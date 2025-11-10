import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import type { IdentifyDocumentStatus } from "@/@types/enum";
import { RenterTableApi } from "../api/renter-table.api";

export type SortDirection = "asc" | "desc";
export type SortField = "fullName" | "createdAt" | "role";

export type SortState = {
  field: SortField;
  direction: SortDirection;
};

type SelectionMap = Record<string, boolean>;

export interface ImageModalState {
  url: string;
  title: string;
}

export interface DocumentDialogState {
  user: UserFull | null;
  document: IdentifyDocumentResponse | null;
  action: "approve" | "reject";
}

export interface StatusChangeDialogState {
  user: UserFull | null;
  document: IdentifyDocumentResponse | null;
  newStatus: "APPROVED" | "REJECTED";
  currentStatus: IdentifyDocumentStatus;
}

export interface DeleteDialogState {
  users: UserFull[];
  isOpen: boolean;
}

export interface UseRenterTableResult {
  loading: boolean;
  rows: UserFull[];
  query: string;
  setQuery: (value: string) => void;
  sortState: SortState;
  setSortState: (state: SortState) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  selected: SelectionMap;
  toggleSelect: (userId: string, value: boolean) => void;
  selectedCount: number;
  isAnySelected: boolean;
  expandedRow: string | null;
  toggleExpandedRow: (userId: string) => void;
  documents: Record<string, IdentifyDocumentResponse | null>;
  loadUserDocument: (userId: string) => Promise<void>;
  imageModal: ImageModalState | null;
  setImageModal: (state: ImageModalState | null) => void;
  documentDialog: DocumentDialogState;
  setDocumentDialog: (state: DocumentDialogState) => void;
  verificationNotes: string;
  setVerificationNotes: (notes: string) => void;
  statusChangeDialog: StatusChangeDialogState | null;
  setStatusChangeDialog: (state: StatusChangeDialogState | null) => void;
  deleteDialog: DeleteDialogState;
  openDeleteDialog: () => void;
  openDeleteDialogForUser: (user: UserFull) => void;
  closeDeleteDialog: () => void;
  confirmDeleteUsers: () => Promise<void>;
  isDeleting: boolean;
  handleDocumentVerification: (user: UserFull) => Promise<void>;
  handleStatusToggle: (user: UserFull, newStatus: "APPROVED" | "REJECTED") => Promise<void>;
  confirmStatusChange: () => Promise<void>;
  confirmDocumentVerification: () => Promise<void>;
  showDocumentColumns: boolean;
}

export function useRenterTable(): UseRenterTableResult {
  const { user: currentUser } = useAuthStore();

  const [users, setUsers] = useState<UserFull[]>([]);
  const [documents, setDocuments] = useState<Record<string, IdentifyDocumentResponse | null>>({});
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectionMap>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<ImageModalState | null>(null);
  const [documentDialog, setDocumentDialog] = useState<DocumentDialogState>({
    user: null,
    document: null,
    action: "approve",
  });
  const [verificationNotes, setVerificationNotes] = useState("");
  const [statusChangeDialog, setStatusChangeDialog] = useState<StatusChangeDialogState | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ users: [], isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const [query, setQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>({ field: "fullName", direction: "asc" });

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const usersData = await RenterTableApi.fetchRenterUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Không thể tải dữ liệu người thuê. Vui lòng thử lại.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadAllUserDocuments = async () => {
      const userRoleUsers = users.filter((user) => user.role === "USER");
      const userIds = userRoleUsers
        .filter((user) => documents[user.id] === undefined)
        .map((user) => user.id);

      if (userIds.length === 0) return;

      const docs = await RenterTableApi.fetchAllUserDocuments(userIds);
      setDocuments((prev) => {
        const updated = { ...prev };
        userIds.forEach((userId) => {
          updated[userId] = docs[userId] ?? null;
        });
        return updated;
      });
    };

    if (users.length > 0) {
      loadAllUserDocuments();
    }
  }, [users]);

  useEffect(() => {
    if (!users.length) {
      setSelected({});
      return;
    }

    setSelected((prev) => {
      const nextSelection: SelectionMap = {};
      users.forEach((user) => {
        if (prev[user.id]) {
          nextSelection[user.id] = true;
        }
      });
      return nextSelection;
    });
  }, [users]);

  const loadUserDocument = async (userId: string) => {
    if (documents[userId] !== undefined) return;

    const doc = await RenterTableApi.fetchUserDocument(userId);
    setDocuments((prev) => ({
      ...prev,
      [userId]: doc,
    }));
  };

  const rows = useMemo(() => {
    if (!Array.isArray(users)) {
      return [];
    }

    let filtered = users.slice();

    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((user) =>
        [
          user.fullName || "Chưa có tên",
          user.userName || "Chưa có tên đăng nhập",
          user.phoneNumber || "Chưa có số điện thoại",
          user.userEmail || "Chưa có email",
        ].some((value) => String(value).toLowerCase().includes(q))
      );
    }

    filtered = filtered.filter((user) => {
      if ((user.role || "USER") !== "USER") return false;
      if (currentUser && user.id === currentUser.id) return false;
      return true;
    });

    filtered.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

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
          break;
      }

      if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, query, sortState, currentUser]);

  const selectedCount = useMemo(
    () => rows.reduce((count, user) => (selected[user.id] ? count + 1 : count), 0),
    [rows, selected]
  );

  const isAnySelected = selectedCount > 0;

  const toggleSelect = (userId: string, value: boolean) => {
    setSelected((prev) => ({ ...prev, [userId]: value }));
  };

  const toggleExpandedRow = (userId: string) => {
    setExpandedRow((prev) => {
      const newExpanded = prev === userId ? null : userId;
      if (newExpanded && documents[newExpanded] === undefined) {
        loadUserDocument(newExpanded);
      }
      return newExpanded;
    });
  };

  const handleDocumentVerification = async (user: UserFull) => {
    if (documents[user.id] === undefined) {
      await loadUserDocument(user.id);
    }

    const document = documents[user.id];
    if (!document) {
      toast.warning("Người dùng chưa có tài liệu");
      return;
    }

    setDocumentDialog({
      user,
      document,
      action: document.status === "PENDING" ? "approve" : "approve",
    });
    setVerificationNotes("");
  };

  const handleStatusToggle = async (user: UserFull, newStatus: "APPROVED" | "REJECTED") => {
    if (documents[user.id] === undefined) {
      await loadUserDocument(user.id);
    }

    const document = documents[user.id];
    if (!document) {
      toast.warning("Người dùng chưa có tài liệu");
      return;
    }

    setStatusChangeDialog({
      user,
      document,
      newStatus,
      currentStatus: document.status,
    });
  };

  const confirmStatusChange = async () => {
    if (!statusChangeDialog || !statusChangeDialog.document || !statusChangeDialog.user) return;

    try {
      const updatedDoc = await RenterTableApi.updateDocumentStatus(
        statusChangeDialog.document.id,
        statusChangeDialog.newStatus,
        verificationNotes || undefined
      );

      setDocuments((prev) => ({
        ...prev,
        [statusChangeDialog.user!.id]: updatedDoc,
      }));

      toast.success("Cập nhật trạng thái tài liệu thành công");
      setStatusChangeDialog(null);
      setVerificationNotes("");
    } catch (error) {
      console.error("Failed to update document status:", error);
      toast.error("Không thể cập nhật trạng thái tài liệu. Vui lòng thử lại.");
    }
  };

  const confirmDocumentVerification = async () => {
    if (!documentDialog.user || !documentDialog.document) return;

    try {
      const newStatus = documentDialog.action === "approve" ? "APPROVED" : "REJECTED";
      const updatedDoc = await RenterTableApi.updateDocumentStatus(
        documentDialog.document.id,
        newStatus,
        verificationNotes || undefined
      );

      setDocuments((prev) => ({
        ...prev,
        [documentDialog.user!.id]: updatedDoc,
      }));

      toast.success("Xác thực tài liệu thành công");
      setDocumentDialog({ user: null, document: null, action: "approve" });
      setVerificationNotes("");
    } catch (error) {
      console.error("Failed to update document status:", error);
      toast.error("Không thể xác thực tài liệu. Vui lòng thử lại.");
    }
  };

  const openDeleteDialog = () => {
    const usersToDelete = rows.filter((user) => selected[user.id]);
    if (!usersToDelete.length) {
      toast.warning("Vui lòng chọn ít nhất một người thuê để xóa");
      return;
    }

    setDeleteDialog({ users: usersToDelete, isOpen: true });
  };

  const openDeleteDialogForUser = (user: UserFull) => {
    setDeleteDialog({ users: [user], isOpen: true });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ users: [], isOpen: false });
  };

  const confirmDeleteUsers = async () => {
    if (!deleteDialog.users.length) return;

    setIsDeleting(true);
    try {
      const ids = deleteDialog.users.map((user) => user.id);
      await RenterTableApi.deleteRenterUsers(ids);

      setUsers((prev) => prev.filter((user) => !ids.includes(user.id)));
      setSelected({});
      toast.success("Đã xóa người thuê thành công");
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete users:", error);
      toast.error("Không thể xóa người thuê. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = Boolean(query);

  const clearFilters = () => {
    setQuery("");
    setSortState({ field: "fullName", direction: "asc" });
  };

  const showDocumentColumns = true;

  return {
    loading,
    rows,
    query,
    setQuery,
    sortState,
    setSortState,
    hasActiveFilters,
    clearFilters,
    selected,
    toggleSelect,
    selectedCount,
    isAnySelected,
    expandedRow,
    toggleExpandedRow,
    documents,
    loadUserDocument,
    imageModal,
    setImageModal,
    documentDialog,
    setDocumentDialog,
    verificationNotes,
    setVerificationNotes,
    statusChangeDialog,
    setStatusChangeDialog,
    deleteDialog,
    openDeleteDialog,
    openDeleteDialogForUser,
    closeDeleteDialog,
    confirmDeleteUsers,
    isDeleting,
    handleDocumentVerification,
    handleStatusToggle,
    confirmStatusChange,
    confirmDocumentVerification,
    showDocumentColumns,
  };
}

