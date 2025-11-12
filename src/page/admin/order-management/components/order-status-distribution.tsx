/**
 * Order Status Distribution Component
 * 
 * Hiển thị phân bổ trạng thái đơn hàng dạng visual với progress bars
 * Giúp dễ dàng nhìn thấy tỷ lệ các trạng thái khác nhau
 */

import { useMemo } from 'react'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3 } from 'lucide-react'

interface OrderStatusDistributionProps {
  orders: OrderBookingDetail[]
  loading?: boolean
}

interface StatusData {
  label: string
  count: number
  percentage: number
  color: string
  bgColor: string
  textColor: string
}

export function OrderStatusDistribution({ orders, loading }: OrderStatusDistributionProps) {
  const distribution = useMemo(() => {
    if (!orders || orders.length === 0) {
      return []
    }

    const total = orders.length
    const statusCounts: Record<string, number> = {}

    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    const statusConfig: Record<string, { label: string; color: string; bgColor: string; textColor: string }> = {
      PENDING: {
        label: 'Chờ xác nhận',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
      },
      CONFIRMED: {
        label: 'Đã xác nhận',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
      },
      IN_PROGRESS: {
        label: 'Đang thực hiện',
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
      },
      COMPLETED: {
        label: 'Hoàn thành',
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
      },
      CANCELLED: {
        label: 'Đã hủy',
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
      },
    }

    const data: StatusData[] = Object.entries(statusCounts)
      .map(([status, count]) => ({
        label: statusConfig[status]?.label || status,
        count,
        percentage: (count / total) * 100,
        color: statusConfig[status]?.color || 'bg-gray-500',
        bgColor: statusConfig[status]?.bgColor || 'bg-gray-50',
        textColor: statusConfig[status]?.textColor || 'text-gray-700',
      }))
      .sort((a, b) => b.count - a.count)

    return data
  }, [orders])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (distribution.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân bổ trạng thái đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có dữ liệu
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          Phân bổ trạng thái đơn hàng
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tỷ lệ phân bổ các trạng thái trong tổng số đơn hàng
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.label} className={`p-4 rounded-lg ${item.bgColor} border border-gray-200`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.count} đơn
                  </Badge>
                </div>
                <span className={`font-bold text-lg ${item.textColor}`}>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full transition-all duration-500 ease-out shadow-sm`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tổng cộng</span>
            <span className="font-bold text-lg">
              {distribution.reduce((sum, item) => sum + item.count, 0)} đơn hàng
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

