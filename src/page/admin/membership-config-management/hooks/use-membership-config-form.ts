import { useState } from "react";
import type {
  MembershipLevel,
  MembershipConfigRequest,
} from "@/@types/membership";
import { useMembershipConfigMutations } from "./use-membership-configs";

export function useMembershipConfigForm() {
  const { create, update, remove } = useMembershipConfigMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MembershipLevel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MembershipLevel | null>(
    null
  );

  const startCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const startEdit = (item: MembershipLevel) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (
    payload:
      | MembershipConfigRequest
      | { discountPercent: number; requiredAmount: number }
  ) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (editing?.id) {
        // Update: chỉ cần discountPercent và requiredAmount
        if ("discountPercent" in payload && "requiredAmount" in payload) {
          await update.mutateAsync({ id: editing.id, data: payload });
        }
      } else {
        // Create: cần đầy đủ MembershipConfigRequest
        if ("level" in payload) {
          await create.mutateAsync(payload);
        }
      }
      setOpen(false);
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  };

  const startDelete = (item: MembershipLevel) => {
    if (!item.id) return;
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    // eslint-disable-next-line no-useless-catch
    try {
      await remove.mutateAsync(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
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
    isSubmitting: create.isPending || update.isPending,
  } as const;
}

