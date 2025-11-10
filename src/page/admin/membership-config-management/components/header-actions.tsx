import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderActionsProps {
  onAdd: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onAdd }) => {
  return (
    <Button onClick={onAdd} className="gap-2">
      <Plus className="h-4 w-4" />
      Thêm hạng mới
    </Button>
  );
};

export default HeaderActions;

