import ModelTable from "./components/table";

export default function ModelManagementPage() {
  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Quản lý model xe</h1>
        <p className="text-sm text-muted-foreground">Quản lý model xe để quản lý các model xe trên hệ thống.</p>
      </div>
      <ModelTable />
    </>
  )
}
