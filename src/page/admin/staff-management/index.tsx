import { StaffStats } from "./components/staff-stats";
import { StaffList } from "./components/staff-list";
import { DepartmentOverview } from "./components/department-overview";

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
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StaffList />
        </div>
        <div>
          <DepartmentOverview />
        </div>
      </div>
    </div>
  );
}
