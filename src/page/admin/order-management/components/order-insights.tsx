/**
 * Order Insights Component
 * 
 * Hiển thị các insights và highlights quan trọng từ dữ liệu đơn hàng
 */

import { useMemo } from 'react'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface OrderInsightsProps {
  orders: OrderBookingDetail[]
  loading?: boolean
}

interface Insight {
  type: 'success' | 'warning' | 'info'
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  value?: string
  color: string
  bgColor: string
}

export function OrderInsights({ orders, loading }: OrderInsightsProps) {
  const insights = useMemo(() => {
    if (!orders || orders.length === 0) {
      return []
    }

    const insights: Insight[] = []

    // Calculate metrics
    const totalOrders = orders.length
    const completedOrders = orders.filter((order) => order.status === 'COMPLETED')
    const pendingOrders = orders.filter((order) => order.status === 'PENDING')
    const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED')
    const unpaidOrders = orders.filter((order) => order.paymentStatus === 'UNPAID')

    const completionRate = (completedOrders.length / totalOrders) * 100
    const cancellationRate = (cancelledOrders.length / totalOrders) * 100

    // High completion rate (good)
    if (completionRate >= 70) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Tỷ lệ hoàn thành cao',
        description: `${completionRate.toFixed(0)}% đơn hàng được hoàn thành thành công`,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
      })
    }

    // High pending orders (warning)
    if (pendingOrders.length > totalOrders * 0.2) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Nhiều đơn chờ xử lý',
        description: `Có ${pendingOrders.length} đơn hàng đang chờ xác nhận`,
        value: `${((pendingOrders.length / totalOrders) * 100).toFixed(0)}%`,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200',
      })
    }

    // High cancellation rate (warning)
    if (cancellationRate > 15) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Tỷ lệ hủy đơn cao',
        description: `${cancellationRate.toFixed(0)}% đơn hàng bị hủy - cần xem xét nguyên nhân`,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
      })
    }

    // Unpaid orders (warning)
    if (unpaidOrders.length > 0) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Đơn chưa thanh toán',
        description: `${unpaidOrders.length} đơn hàng chưa được thanh toán`,
        value: `${((unpaidOrders.length / totalOrders) * 100).toFixed(0)}%`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
      })
    }

    // Good performance (info)
    if (completionRate >= 80 && cancellationRate < 10) {
      insights.push({
        type: 'info',
        icon: TrendingUp,
        title: 'Hiệu suất tốt',
        description: 'Hệ thống đang hoạt động ổn định với tỷ lệ thành công cao',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
      })
    }

    return insights
  }, [orders])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Insights & Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có đủ dữ liệu để phân tích
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          Insights & Highlights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Phân tích và đề xuất dựa trên dữ liệu đơn hàng
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${insight.bgColor} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${insight.color} mt-0.5`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-sm ${insight.color}`}>
                        {insight.title}
                      </h4>
                      {insight.value && (
                        <Badge variant="secondary" className="text-xs">
                          {insight.value}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            💡 Insights được cập nhật tự động dựa trên dữ liệu hiện tại
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

