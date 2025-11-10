import { useLocation } from "react-router-dom";
import PageShell from "../model-management/components/page-shell";
import UserMembershipList from "./components/user-membership-list";
import MembershipConfigList from "./components/membership-config-list";

export default function MembershipConfigManagementPage() {
  const location = useLocation();
  const isConfigsPage = location.pathname.includes("/configs");

  return (
    <PageShell
      title={isConfigsPage ? "Quản lý hạng thành viên" : "Danh sách thành viên"}
      subtitle={
        isConfigsPage
          ? "Tạo, chỉnh sửa và xóa các hạng thành viên trong hệ thống"
          : "Xem và quản lý hạng thành viên của người dùng trong hệ thống"
      }
    >
      {isConfigsPage ? <MembershipConfigList /> : <UserMembershipList />}
    </PageShell>
  );
}
