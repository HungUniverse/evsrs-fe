import { useMembershipConfigs } from "@/hooks/use-membership-configs";
import { useMembershipConfigForm } from "@/hooks/use-membership-config-form";
import HeaderActions from "./header-actions";
import MembershipConfigTable from "./membership-config-table";
import MembershipConfigFormDialog from "./membership-config-form-dialog";
import DeleteConfirmationDialog from "./delete-confirmation-dialog";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembershipConfigList() {
  const { data: configs, isLoading } = useMembershipConfigs();
  const form = useMembershipConfigForm();

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Quản lý hạng thành viên</h2>
        </div>
        <HeaderActions onAdd={form.startCreate} />
      </div>

      <MembershipConfigTable
        data={configs || []}
        onEdit={form.startEdit}
        onDelete={form.startDelete}
      />

      <MembershipConfigFormDialog
        open={form.open}
        onOpenChange={form.setOpen}
        initialData={form.editing || undefined}
        onSubmit={form.submit}
      />

      <DeleteConfirmationDialog
        open={form.deleteDialogOpen}
        onOpenChange={form.setDeleteDialogOpen}
        item={form.itemToDelete}
        onConfirm={form.confirmDelete}
        isDeleting={form.isDeleting}
      />
    </div>
  );
}

