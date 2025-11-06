import React from "react";
import { Button } from "@/components/ui/button";
import type { Amenity } from "@/@types/car/amentities";

interface RowActionsProps {
  item: Amenity;
  onEdit: (item: Amenity) => void;
  onDelete: (item: Amenity) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="space-x-2 text-right">
      <Button size="sm" variant="outline" onClick={() => onEdit(item)}>Sửa</Button>
      <Button size="sm" variant="destructive" onClick={() => onDelete(item)}>Xóa</Button>
    </div>
  );
};

export default RowActions;


