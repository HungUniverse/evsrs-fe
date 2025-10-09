import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface ComplaintItem {
  id: string;
  status: "pending" | "in_progress" | "resolved" | "rejected" | string;
}

interface StatsCardsProps {
  complaints: ComplaintItem[];
}

export default function StatsCards({ complaints }: StatsCardsProps) {
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng khiếu nại</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{total}</div>
          <p className="text-xs text-muted-foreground">{resolved} đã giải quyết</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{pending}</div>
          <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{inProgress}</div>
          <p className="text-xs text-muted-foreground">Đang được xử lý</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{color: '#00D166'}}>{resolved}</div>
          <p className="text-xs text-muted-foreground">
            {total ? Math.round((resolved / total) * 100) : 0}% tổng số
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


