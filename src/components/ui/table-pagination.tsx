import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

// Component pagination sử dụng shadcn pagination
export function TablePagination({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPreviousPage,
  onNextPage,
  onPageChange,
  loading = false,
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  const renderPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

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
      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1 && !loading && onPageChange) {
                    onPageChange(1);
                  }
                }}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "gap-1 px-2.5",
                  (currentPage === 1 || loading)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
                aria-label="Đầu trang"
              >
                <ChevronsLeft className="h-4 w-4" />
              </a>
            </PaginationItem>
            <PaginationItem>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1 && !loading) onPreviousPage();
                }}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "gap-0 px-2.5",
                  (currentPage === 1 || loading)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </a>
            </PaginationItem>
            {renderPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!loading && page !== currentPage && onPageChange) {
                        onPageChange(page);
                      }
                    }}
                    isActive={page === currentPage}
                    className={
                      loading ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages && !loading) onNextPage();
                }}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "gap-0 px-2.5",
                  (currentPage === totalPages || loading)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
                aria-label="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </a>
            </PaginationItem>
            <PaginationItem>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages && !loading && onPageChange) {
                    onPageChange(totalPages);
                  }
                }}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "gap-1 px-2.5",
                  (currentPage === totalPages || loading)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
                aria-label="Cuối trang"
              >
                <ChevronsRight className="h-4 w-4" />
              </a>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

