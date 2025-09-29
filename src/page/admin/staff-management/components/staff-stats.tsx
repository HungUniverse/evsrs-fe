import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStaff } from "@/mockdata/mock-admin";

export function StaffStats() {
  const totalStaff = mockStaff.length;
  const activeStaff = mockStaff.filter(staff => staff.status === 'active').length;
  
  const totalSalary = mockStaff.reduce((sum, staff) => sum + staff.salary, 0);
  const averageSalary = totalSalary / totalStaff;

  // Group by department
  const departmentStats = mockStaff.reduce((acc, staff) => {
    acc[staff.department] = (acc[staff.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="m22 21-3-3m0 0a3 3 0 1 1-4.242-4.242 3 3 0 0 1 4.242 4.242Z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{totalStaff}</div>
          <p className="text-xs text-muted-foreground">
            {activeStaff} đang hoạt động
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhân viên hoạt động</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{activeStaff}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((activeStaff / totalStaff) * 100)}% tổng số
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng chi phí lương</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{formatCurrency(totalSalary)}</div>
          <p className="text-xs text-muted-foreground">
            Trung bình: {formatCurrency(averageSalary)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Phòng ban</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{Object.keys(departmentStats).length}</div>
          <p className="text-xs text-muted-foreground">
            Phòng ban trong hệ thống
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
