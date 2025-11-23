import { useEffect, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { StaffRequest, UserFull } from "@/@types/auth.type";
import type { Depot } from "@/@types/car/depot";
import { UserFullAPI } from "@/apis/user.api";
import { depotAPI } from "@/apis/depot.api";

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 100,
};

export type SortDirection = "asc" | "desc";
export type SortField = "fullName" | "createdAt" | "role";

export type SortState = {
  field: SortField;
  direction: SortDirection;
};

type SelectionMap = Record<string, boolean>;

export interface DeleteDialogState {
  users: UserFull[];
  isOpen: boolean;
}

export interface ChangeDepotDialogState {
  isOpen: boolean;
  user: UserFull | null;
  selectedDepotId: string;
  isSubmitting: boolean;
}

export interface UseStaffTableResult {
  loading: boolean;
  rows: UserFull[];
  query: string;
  setQuery: (value: string) => void;
  selectedDepotId: string;
  setSelectedDepotId: (value: string) => void;
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
  deleteDialog: DeleteDialogState;
  openDeleteDialog: () => void;
  openDeleteDialogForUser: (user: UserFull) => void;
  closeDeleteDialog: () => void;
  confirmDeleteUsers: () => Promise<void>;
  isDeleting: boolean;
  changeDepotDialog: ChangeDepotDialogState;
  openChangeDepotForUser: (user: UserFull) => void;
  closeChangeDepotDialog: () => void;
  setChangeDepotSelectedId: (depotId: string) => void;
  confirmChangeDepot: () => Promise<void>;
  depotList: Depot[];
  depotMap: Record<string, Depot>;
  isCreating: boolean;
  createDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  handleCreateStaff: (data: StaffRequest) => Promise<void>;
  form: UseFormReturn<StaffRequest>;
  getDepotName: (depotId: string | undefined) => string;
}

export function useStaffTable(): UseStaffTableResult {
  const { user: currentUser } = useAuthStore();

  const [users, setUsers] = useState<UserFull[]>([]);
  const [depotMap, setDepotMap] = useState<Record<string, Depot>>({});
  const [depotList, setDepotList] = useState<Depot[]>([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [selectedDepotId, setSelectedDepotId] = useState("");
  const [sortState, setSortState] = useState<SortState>({ field: "fullName", direction: "asc" });
  const [selected, setSelected] = useState<SelectionMap>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({ users: [], isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const [changeDepotDialog, setChangeDepotDialog] = useState<ChangeDepotDialogState>({
    isOpen: false,
    user: null,
    selectedDepotId: "",
    isSubmitting: false,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<StaffRequest>();

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      try {
        // Fetch staff users
        const usersResponse = await UserFullAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
        const usersItems = usersResponse?.data?.data?.items;
        const usersData = Array.isArray(usersItems) ? usersItems : [];

        // Fetch depot list
        const depotResponse = await depotAPI.getAll(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.limit);
        const depotItems = depotResponse?.data?.data?.items;
        const depotListData = Array.isArray(depotItems) ? depotItems : [];

        setUsers(usersData);
        setDepotList(depotListData);

        const depotIds = usersData
          .filter((user: UserFull) => user.role === "STAFF" && user.depotId)
          .map((user: UserFull) => user.depotId as string);

        // Fetch depot map by IDs
        if (depotIds.length) {
          const uniqueIds = Array.from(new Set(depotIds));
          const results = await Promise.all(
            uniqueIds.map(async (depotId) => {
              try {
                const response = await depotAPI.getById(depotId);
                return response ?? null;
              } catch (error) {
                console.error(`Failed to fetch depot ${depotId}`, error);
                return null;
              }
            })
          );

          const depotDetails = results.reduce<Record<string, Depot>>((accumulator, depot, index) => {
            if (depot) {
              const id = uniqueIds[index];
              accumulator[id] = depot;
            }
            return accumulator;
          }, {});
          setDepotMap(depotDetails);
        } else {
          setDepotMap({});
        }
      } catch (error) {
        console.error("Failed to load staff data", error);
        toast.error("Không thể tải dữ liệu nhân viên. Vui lòng thử lại.");
        setUsers([]);
        setDepotMap({});
        setDepotList([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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
      if (user.role !== "STAFF") {
        return false;
      }

      if (currentUser && user.id === currentUser.id) {
        return false;
      }

      // Filter by depot if selected
      if (selectedDepotId) {
        const userDepotId = user.depotId || "";
        if (userDepotId !== selectedDepotId) {
          return false;
        }
      }

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
          aVal = a.role || "STAFF";
          bVal = b.role || "STAFF";
          break;
        default:
          break;
      }

      if (aVal < bVal) {
        return sortState.direction === "asc" ? -1 : 1;
      }

      if (aVal > bVal) {
        return sortState.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

    return filtered;
  }, [users, query, selectedDepotId, sortState, currentUser]);

  const selectedCount = useMemo(
    () => rows.reduce((count, user) => (selected[user.id] ? count + 1 : count), 0),
    [rows, selected]
  );

  const isAnySelected = selectedCount > 0;

  const toggleSelect = (userId: string, value: boolean) => {
    setSelected((prev) => ({ ...prev, [userId]: value }));
  };

  const toggleExpandedRow = (userId: string) => {
    setExpandedRow((prev) => (prev === userId ? null : userId));
  };

  const openDeleteDialog = () => {
    const usersToDelete = rows.filter((user) => selected[user.id]);
    if (!usersToDelete.length) {
      toast.warning("Vui lòng chọn ít nhất một nhân viên để xóa");
      return;
    }

    setDeleteDialog({ users: usersToDelete, isOpen: true });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ users: [], isOpen: false });
  };

  const openDeleteDialogForUser = (user: UserFull) => {
    setDeleteDialog({ users: [user], isOpen: true });
  };

  const confirmDeleteUsers = async () => {
    if (!deleteDialog.users.length) {
      return;
    }

    setIsDeleting(true);

    try {
      const ids = deleteDialog.users.map((user) => user.id);
      await Promise.all(ids.map((id) => UserFullAPI.delete(id)));

      setUsers((prev) => prev.filter((user) => !ids.includes(user.id)));
      setSelected({});
      toast.success("Đã xóa nhân viên thành công");
      closeDeleteDialog();
    } catch (error) {
      console.error("Failed to delete staff", error);
      toast.error("Không thể xóa nhân viên. Vui lòng thử lại");
    } finally {
      setIsDeleting(false);
    }
  };

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

  const setChangeDepotSelectedId = (depotId: string) => {
    setChangeDepotDialog((prev) => ({ ...prev, selectedDepotId: depotId }));
  };

  const confirmChangeDepot = async () => {
    if (!changeDepotDialog.user || !changeDepotDialog.selectedDepotId) {
      toast.error("Vui lòng chọn kho làm việc");
      return;
    }

    setChangeDepotDialog((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await UserFullAPI.updateDepot(changeDepotDialog.user.id, changeDepotDialog.selectedDepotId);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === changeDepotDialog.user?.id
            ? { ...user, depotId: changeDepotDialog.selectedDepotId }
            : user
        )
      );

      const depotInfo = depotList.find((depot) => depot.id === changeDepotDialog.selectedDepotId);
      if (depotInfo) {
        setDepotMap((prev) => ({ ...prev, [depotInfo.id]: depotInfo }));
      }

      toast.success("Cập nhật kho làm việc thành công");
      closeChangeDepotDialog();
    } catch (error) {
      console.error("Failed to update staff depot", error);
      toast.error("Không thể cập nhật kho làm việc. Vui lòng thử lại");
      setChangeDepotDialog((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const openCreateDialog = () => {
    form.reset();
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    form.reset();
  };

  const handleCreateStaff = async (data: StaffRequest) => {
    setIsCreating(true);

    try {
      const newStaff = await UserFullAPI.createStaff(data);
      setUsers((prev) => [...prev, newStaff]);
      toast.success("Tạo nhân viên thành công");
      setCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create staff", error);
      toast.error("Không thể tạo nhân viên. Vui lòng thử lại");
    } finally {
      setIsCreating(false);
    }
  };

  const hasActiveFilters = Boolean(query || selectedDepotId);

  const clearFilters = () => {
    setQuery("");
    setSelectedDepotId("");
    setSortState({ field: "fullName", direction: "asc" });
  };

  const getDepotName = (depotId: string | undefined): string => {
    if (!depotId) {
      return "Chưa phân công";
    }

    const depot = depotMap[depotId];
    return depot ? depot.name : "Không tìm thấy";
  };

  return {
    loading,
    rows,
    query,
    setQuery,
    selectedDepotId,
    setSelectedDepotId,
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
    deleteDialog,
    openDeleteDialog,
    openDeleteDialogForUser,
    closeDeleteDialog,
    confirmDeleteUsers,
    isDeleting,
    changeDepotDialog,
    openChangeDepotForUser,
    closeChangeDepotDialog,
    setChangeDepotSelectedId,
    confirmChangeDepot,
    depotList,
    depotMap,
    isCreating,
    createDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    handleCreateStaff,
    form,
    getDepotName,
  };
}

