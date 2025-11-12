import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import { AIIcon } from "@/components/ui/ai-icon";
import type { Depot } from "@/@types/car/depot";

interface RowActionsProps {
  item: Depot;
  onEdit: (item: Depot) => void;
  onDelete: (item: Depot) => void;
  onForecast: (item: Depot) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ item, onEdit, onDelete, onForecast }) => (
  <div className="flex items-center justify-end gap-2">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm" variant="ghost" onClick={() => onForecast(item)}>
          <span className="sr-only">Gợi ý AI</span>
          <AIIcon size={18} className="text-purple-500" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Gợi ý AI</TooltipContent>
    </Tooltip>
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

export default RowActions;

