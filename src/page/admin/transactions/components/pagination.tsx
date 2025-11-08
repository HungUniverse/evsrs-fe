import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionTablePaginationProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loading: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function TransactionTablePagination({
  pageNumber,
  totalPages,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  loading,
  onNextPage,
  onPreviousPage,
}: TransactionTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {loading ? (
          <span>Đang tải...</span>
        ) : (
          <span>
            Trang {pageNumber} / {totalPages || 1} ({totalCount} giao dịch)
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!hasPreviousPage || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNextPage || loading}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

