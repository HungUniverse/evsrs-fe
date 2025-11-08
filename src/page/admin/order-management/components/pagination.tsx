import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderTablePaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loading: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function OrderTablePagination({
  pageNumber,
  totalPages,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  loading,
  onNextPage,
  onPreviousPage,
}: OrderTablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Trang {pageNumber} / {totalPages} (Tổng: {totalCount} đơn đặt xe)
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPreviousPage} disabled={!hasPreviousPage || loading}>
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <Button variant="outline" size="sm" onClick={onNextPage} disabled={!hasNextPage || loading}>
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

