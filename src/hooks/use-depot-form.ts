import { useState } from "react";
import type { Depot, DepotRequest } from "@/@types/car/depot";
import { useDepotMutations } from "./use-depots";
import { toast } from "sonner";

export function useDepotForm() {
  const { create, update, remove } = useDepotMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Depot | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Depot | null>(null);

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (item: Depot) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: DepotRequest) => {
    try {
      if (editing?.id) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("Trạm đã được cập nhật thành công!");
      } else {
        await create.mutateAsync(payload);
        toast.success("Trạm đã được tạo thành công!");
      }
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const startDelete = (item: Depot) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await remove.mutateAsync(itemToDelete.id);
      toast.success("Trạm đã được xóa thành công!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Xóa trạm thất bại");
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

