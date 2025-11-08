import { useState } from "react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import type { SystemConfigType } from "@/@types/enum";
import { useSystemConfigMutations } from "./use-system-configs";
import { toast } from "sonner";

export function useSystemConfigForm() {
  const { create, update, remove } = useSystemConfigMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SystemConfigTypeResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SystemConfigTypeResponse | null>(null);

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  
  const startEdit = (item: SystemConfigTypeResponse) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: { key: string; value: string; configType: SystemConfigType }) => {
    try {
      if (editing?.id) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("Cập nhật cấu hình thành công");
      } else {
        await create.mutateAsync(payload);
        toast.success("Tạo cấu hình thành công");
      }
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const startDelete = (item: SystemConfigTypeResponse) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await remove.mutateAsync(itemToDelete.id);
      toast.success("Xóa cấu hình thành công");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Xóa cấu hình thất bại");
    }
  };

  return {
    open,
    setOpen,
    editing,
    startCreate,
    startEdit,
    submit,
    startDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    confirmDelete,
    isDeleting: remove.isPending,
  } as const;
}

