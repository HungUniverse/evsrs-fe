import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, ArrowRight } from "lucide-react";

interface NavigationCardsProps {
  activeTab: "users" | "configs";
}

export default function NavigationCards({ activeTab }: NavigationCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Card 1: Danh sách thành viên */}
      <Link to="/admin/membership-config-management?tab=users" className="block">
        <Card
          className={`h-full transition-all hover:shadow-lg cursor-pointer ${
            activeTab === "users"
              ? "ring-2 ring-primary ring-offset-2 border-primary"
              : "hover:border-primary/50"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Danh sách thành viên</CardTitle>
                  <CardDescription className="mt-1">
                    Xem và quản lý hạng thành viên của người dùng
                  </CardDescription>
                </div>
              </div>
              <ArrowRight
                className={`h-5 w-5 transition-transform ${
                  activeTab === "users" ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Xem danh sách tất cả người dùng và hạng thành viên hiện tại của họ. Kiểm tra tiến độ và thống kê
              thành viên.
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Card 2: Danh sách hạng thành viên */}
      <Link to="/admin/membership-config-management?tab=configs" className="block">
        <Card
          className={`h-full transition-all hover:shadow-lg cursor-pointer ${
            activeTab === "configs"
              ? "ring-2 ring-primary ring-offset-2 border-primary"
              : "hover:border-primary/50"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Quản lý hạng thành viên</CardTitle>
                  <CardDescription className="mt-1">
                    Tạo, chỉnh sửa và xóa các hạng thành viên
                  </CardDescription>
                </div>
              </div>
              <ArrowRight
                className={`h-5 w-5 transition-transform ${
                  activeTab === "configs" ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quản lý cấu hình các hạng thành viên như Bronze, Silver, Gold. Thiết lập mức giảm giá và điều kiện
              nâng cấp.
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

