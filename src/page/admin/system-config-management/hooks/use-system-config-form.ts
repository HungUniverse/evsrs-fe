import { useState } from "react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";
import type { SystemConfigType } from "@/@types/enum";
import { useSystemConfigMutations } from "./use-system-configs";
import { toast } from "sonner";

export function useSystemConfigForm() {
  const { update } = useSystemConfigMutations();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SystemConfigTypeResponse | null>(null);
  
  const startEdit = (item: SystemConfigTypeResponse) => {
    setEditing(item);
    setOpen(true);
  };

  const submit = async (payload: { key: string; value: string; configType: SystemConfigType }) => {
    if (!editing?.id) {
      toast.error("Không thể cập nhật: thiếu ID");
      return;
    }
    
    try {
      await update.mutateAsync({ id: editing.id, data: payload });
      toast.success("Cập nhật cấu hình thành công");
      setOpen(false);
    } catch {
      toast.error("Cập nhật cấu hình thất bại");
    }
  };

  return {
    open,
    setOpen,
    editing,
    startEdit,
    submit,
  } as const;
}

