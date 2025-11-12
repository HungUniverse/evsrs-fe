import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";
import type { SystemConfigTypeResponse } from "@/@types/system-config";

interface RowActionsProps {
  item: SystemConfigTypeResponse;
  onEdit: (item: SystemConfigTypeResponse) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ item, onEdit }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Mở menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => onEdit(item)}>
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default RowActions;

