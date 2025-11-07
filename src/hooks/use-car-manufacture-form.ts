import { useState } from "react";
import type { CarManufacture, CarManufactureRequest } from "@/@types/car/carManufacture";
import { useCarManufactureMutations } from "./use-car-manufactures";
import { toast } from "sonner";

export function useCarManufactureForm() {
  const { create, update, remove } = useCarManufactureMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CarManufacture | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CarManufacture | null>(null);

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (item: CarManufacture) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: CarManufactureRequest) => {
    try {
      if (editing?.id) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("Nhà sản xuất xe đã được cập nhật thành công!");
      } else {
        await create.mutateAsync(payload);
        toast.success("Nhà sản xuất xe đã được tạo thành công!");
      }
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const startDelete = (item: CarManufacture) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await remove.mutateAsync(itemToDelete.id);
      toast.success("Nhà sản xuất xe đã được xóa thành công!");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Xóa nhà sản xuất xe thất bại");
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

