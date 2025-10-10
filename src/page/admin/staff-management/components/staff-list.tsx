import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockStaff } from "@/mockdata/mock-admin";

export function StaffList() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return 'Không hoạt động';
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      "OPS": "bg-green-100 text-green-800",
      "TECH": "bg-blue-100 text-blue-800",
      "CS": "bg-yellow-100 text-yellow-800",
      "LOG": "bg-purple-100 text-purple-800",
      "FIN": "bg-orange-100 text-orange-800",
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách nhân viên</CardTitle>
          <Button>Thêm nhân viên</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockStaff.map((staff) => (
            <div key={staff.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img 
                src={staff.avatar} 
                alt={staff.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{staff.name}</h4>
                <p className="text-sm text-muted-foreground">{staff.email}</p>
                <p className="text-sm text-muted-foreground">{staff.phone}</p>
                <p className="text-xs text-muted-foreground">
                  Tham gia: {new Date(staff.joinDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="text-center">
                <Badge className={getDepartmentColor(staff.department)}>
                  {staff.department}
                </Badge>
                <p className="text-sm font-medium mt-1">{staff.position}</p>
              </div>
              <div className="text-center">
                <p className="font-medium">{formatCurrency(staff.salary)}</p>
                <p className="text-xs text-muted-foreground">lương/tháng</p>
              </div>
              <div className="text-center">
                <Badge className={getStatusColor(staff.status)}>
                  {getStatusText(staff.status)}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Xem</Button>
                <Button variant="outline" size="sm">Sửa</Button>
                <Button variant="outline" size="sm">Vô hiệu hóa</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
