import { useState } from "react";
import type { CarEV, CarEVRequest } from "@/@types/car/carEv";
import { useCarEVMutations } from "./use-car-evs";
import { toast } from "sonner";

export function useCarEVForm() {
  const { create, update, remove } = useCarEVMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CarEV | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CarEV | null>(null);

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (item: CarEV) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: CarEVRequest) => {
    try {
      if (editing?.id) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("Xe điện đã được cập nhật thành công!");
      } else {
        await create.mutateAsync(payload);
        toast.success("Xe điện đã được tạo thành công!");
      }
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const startDelete = (item: CarEV) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await remove.mutateAsync(itemToDelete.id);
      toast.success("Xe điện đã được xóa thành công!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Xóa xe điện thất bại");
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

