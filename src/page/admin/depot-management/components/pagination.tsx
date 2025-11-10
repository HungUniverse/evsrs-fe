import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPreviousPage,
  onNextPage,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-700">
        Hiển thị <span className="font-medium">{startItem}</span> -{" "}
        <span className="font-medium">{endItem}</span> của{" "}
        <span className="font-medium">{totalItems}</span> kết quả
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Trang trước</TooltipContent>
        </Tooltip>
        <span className="text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Trang sau</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Pagination;

