import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderActionsProps {
  onAdd: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onAdd }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAdd} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Thêm trạm mới
      </Button>
    </div>
  );
};

export default HeaderActions;

