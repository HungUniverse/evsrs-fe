import { CustomerStats } from "./components/customer-stats";
import { CustomerList } from "./components/customer-list";

export default function CustomerManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin và trạng thái khách hàng trong hệ thống
        </p>
      </div>
      
      <CustomerStats />
      
      <CustomerList />
    </div>
  );
}
