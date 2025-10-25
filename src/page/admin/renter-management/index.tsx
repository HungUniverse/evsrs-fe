import { RenterTable } from "./components/table";

export default function RenterManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người thuê</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và trạng thái người thuê trong hệ thống
        </p>
      </div>

      <RenterTable />
    </div>
  );
}
