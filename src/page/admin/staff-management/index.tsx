import { StaffStats } from "./components/staff-stats";
import { StaffList } from "./components/staff-list";


export default function StaffManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý nhân viên</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin nhân viên và phân bổ công việc trong hệ thống
        </p>
      </div>

      <StaffStats />
      <StaffList />
    </div>
  );
}
