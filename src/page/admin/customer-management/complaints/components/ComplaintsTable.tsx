import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ComplaintItem {
  id: string;
  customerName: string;
  customerEmail: string;
  type: "service" | "billing" | "vehicle" | "other" | string;
  priority: "low" | "medium" | "high" | string;
  status: "pending" | "in_progress" | "resolved" | "rejected" | string;
  title: string;
  description: string;
  complaintDate: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Chờ xử lý",
  in_progress: "Đang xử lý",
  resolved: "Đã giải quyết",
  rejected: "Đã từ chối",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const typeLabels = {
  service: "Dịch vụ",
  billing: "Thanh toán",
  vehicle: "Phương tiện",
  other: "Khác",
};

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'in_progress':
      return <AlertCircle className="h-4 w-4" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

export default function ComplaintsTable({ complaints }: { complaints: ComplaintItem[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách khiếu nại</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KN</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{complaint.customerName}</div>
                      <div className="text-sm text-muted-foreground">{complaint.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(typeLabels as any)[complaint.type] || complaint.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{complaint.title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {complaint.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={(priorityColors as any)[complaint.priority] || ""}>
                      {(priorityLabels as any)[complaint.priority] || complaint.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <Badge className={(statusColors as any)[complaint.status] || ""}>
                        {(statusLabels as any)[complaint.status] || complaint.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(complaint.complaintDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Chi tiết</Button>
                      {complaint.status === 'pending' && (
                        <Button size="sm" variant="default">Nhận xử lý</Button>
                      )}
                      {complaint.status === 'in_progress' && (
                        <Button size="sm" variant="default">Giải quyết</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


