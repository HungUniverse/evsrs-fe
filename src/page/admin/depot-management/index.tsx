import DepotTable from "./components/table";

export default function DepotManagementPage() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Quản lý trạm</h1>
        <p className="text-sm text-muted-foreground">Quản lý trạm để quản lý các trạm trên hệ thống.</p>
      </div>
      <DepotTable />
    </div>
  );
}
