import { useState } from "react";
import { useMembershipConfigs } from "../hooks/use-membership-configs";
import { useMembershipConfigForm } from "../hooks/use-membership-config-form";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { TablePagination } from "@/components/ui/table-pagination";
import MembershipConfigTable from "./membership-config-table";
import MembershipConfigFormDialog from "./membership-config-form-dialog";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembershipConfigList() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const { data: configs, isLoading } = useMembershipConfigs();
  const form = useMembershipConfigForm();
  const pagination = useTablePagination({
    items: configs || [],
    pageNumber,
    pageSize,
    setPageNumber,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Quản lý hạng thành viên</h2>
          <Skeleton className="h-9 w-32 ml-auto" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Quản lý hạng thành viên</h2>
      </div>

      <MembershipConfigTable
        data={pagination.paginatedData}
        onEdit={form.startEdit}
        startIndex={pagination.startItem}
      />

      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        startItem={pagination.startItem}
        endItem={pagination.endItem}
        totalItems={pagination.totalItems}
        onPreviousPage={pagination.handlePreviousPage}
        onNextPage={pagination.handleNextPage}
        onPageChange={pagination.setPageNumber}
        loading={isLoading}
      />

      <MembershipConfigFormDialog
        open={form.open}
        onOpenChange={form.setOpen}
        initialData={form.editing || undefined}
        onSubmit={form.submit}
      />


    </div>
  );
}

