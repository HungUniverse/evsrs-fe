import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStaff } from "@/mockdata/mock-admin";

export function DepartmentOverview() {
  const departmentStats = mockStaff.reduce((acc, staff) => {
    if (!acc[staff.department]) {
      acc[staff.department] = {
        name: staff.department,
        totalStaff: 0,
        activeStaff: 0,
        totalSalary: 0,
        positions: new Set<string>(),
      };
    }
    acc[staff.department].totalStaff++;
    if (staff.status === 'active') {
      acc[staff.department].activeStaff++;
    }
    acc[staff.department].totalSalary += staff.salary;
    acc[staff.department].positions.add(staff.position);
    return acc;
  }, {} as Record<string, {
    name: string;
    totalStaff: number;
    activeStaff: number;
    totalSalary: number;
    positions: Set<string>;
  }>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      'Quản lý': 'bg-blue-100 text-blue-800',
      'Vận hành': 'bg-green-100 text-green-800',
      'Dịch vụ': 'bg-yellow-100 text-yellow-800',
      'Kỹ thuật': 'bg-purple-100 text-purple-800',
      'Tài chính': 'bg-orange-100 text-orange-800',
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bổ theo phòng ban</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.values(departmentStats).map((dept, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Badge className={getDepartmentColor(dept.name)}>
                  {dept.name}
                </Badge>
                <div>
                  <h4 className="font-medium">{dept.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {Array.from(dept.positions).join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{dept.totalStaff} nhân viên</p>
                <p className="text-sm text-muted-foreground">
                  {dept.activeStaff} hoạt động
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(dept.totalSalary)}/tháng
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
