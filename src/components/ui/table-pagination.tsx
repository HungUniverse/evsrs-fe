import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  loading?: boolean;
}

/**
 * Component pagination chung cho table
 * Chỉ hiển thị khi có hơn 10 items
 */
export function TablePagination({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPreviousPage,
  onNextPage,
  loading = false,
}: TablePaginationProps) {
  // Chỉ hiển thị pagination khi có hơn 10 items
  if (totalItems <= 10) {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị <span className="font-medium">{startItem}</span> -{" "}
          <span className="font-medium">{endItem}</span> của{" "}
          <span className="font-medium">{totalItems}</span> kết quả
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        {loading ? (
          <span>Đang tải...</span>
        ) : (
          <span>
            Hiển thị <span className="font-medium">{startItem}</span> -{" "}
            <span className="font-medium">{endItem}</span> của{" "}
            <span className="font-medium">{totalItems}</span> kết quả
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Trang trước</TooltipContent>
        </Tooltip>
        <span className="text-sm text-muted-foreground">
          Trang {currentPage} / {totalPages}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Trang sau</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

