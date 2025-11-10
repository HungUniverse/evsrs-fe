import { useSearchParams } from "react-router-dom";
import PageShell from "../model-management/components/page-shell";
import NavigationCards from "./components/navigation-cards";
import UserMembershipList from "./components/user-membership-list";
import MembershipConfigList from "./components/membership-config-list";

export default function MembershipConfigManagementPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "users";

  // Validate tab
  const activeTab = tab === "configs" ? "configs" : "users";

  return (
    <PageShell
      title="Quản lý cấu hình hạng thành viên"
      subtitle="Quản lý danh sách thành viên và cấu hình hạng thành viên trong hệ thống"
    >
      <div className="space-y-8">
        <NavigationCards activeTab={activeTab} />

        {activeTab === "users" && <UserMembershipList />}
        {activeTab === "configs" && <MembershipConfigList />}
      </div>
    </PageShell>
  );
}
