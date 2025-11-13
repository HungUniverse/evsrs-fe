import { useState } from "react";
import type { Model, ModelRequest } from "@/@types/car/model";
import { useModelMutations } from "./use-models";
import { toast } from "sonner";

export function useModelForm() {
  const { create, update, remove } = useModelMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Model | null>(null);

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (item: Model) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: ModelRequest) => {
    try {
      if (editing?.id) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("Model xe đã được cập nhật thành công!");
      } else {
        await create.mutateAsync(payload);
        toast.success("Model xe đã được tạo thành công!");
      }
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const startDelete = (item: Model) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await remove.mutateAsync(itemToDelete.id);
      toast.success("Model xe đã được xóa thành công!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Xóa model xe thất bại");
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

