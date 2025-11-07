import OrderTable from "./components/table";

export default function OrderManagementPage() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Quản lý đơn đặt xe</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý đơn đặt xe để quản lý các đơn đặt xe trên hệ thống.
        </p>
      </div>
      <OrderTable />
    </div>
  );
}
