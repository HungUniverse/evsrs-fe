import { useState } from "react";
import type { Amenity, AmenityRequest } from "@/@types/car/amentities";
import { useAmenityMutations } from "./use-amenities";
import { toast } from "sonner";

export function useAmenityForm() {
  const { create, update, remove } = useAmenityMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Amenity | null>(null);

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const startEdit = (item: Amenity) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: AmenityRequest) => {
    try {
      if (editing?.id) {
        await update.mutateAsync({ id: editing.id, data: payload });
        toast.success("Cập nhật tiện ích thành công");
      } else {
        await create.mutateAsync(payload);
        toast.success("Tạo tiện ích thành công");
      }
      setOpen(false);
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const startDelete = (item: Amenity) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await remove.mutateAsync(itemToDelete.id);
      toast.success("Xóa tiện ích thành công");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error("Xóa tiện ích thất bại");
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

