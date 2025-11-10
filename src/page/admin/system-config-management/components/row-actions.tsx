import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";

interface RowActionsProps {
  item: SystemConfigTypeResponse;
  onEdit: (item: SystemConfigTypeResponse) => void;
  onDelete: (item: SystemConfigTypeResponse) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sửa</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="destructive" onClick={() => onDelete(item)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Xóa</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default RowActions;

