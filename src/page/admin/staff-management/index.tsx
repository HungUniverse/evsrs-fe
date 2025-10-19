
import { StaffTable } from "./components/table";

export default function StaffManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và trạng thái nhân viên trong hệ thống
        </p>
      </div>

      <StaffTable />
    </div>
  );
}
