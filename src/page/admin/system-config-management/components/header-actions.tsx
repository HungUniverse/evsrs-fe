import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  onAdd: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onAdd }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAdd}>Thêm cấu hình</Button>
    </div>
  );
};

export default HeaderActions;

