import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  onAdd: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ onAdd }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onAdd}>Thêm nhà sản xuất xe</Button>
    </div>
  );
};

export default HeaderActions;

