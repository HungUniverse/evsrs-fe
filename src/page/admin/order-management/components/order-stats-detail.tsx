/**
 * Order Detailed Statistics Component
 * 
 * Hiển thị thống kê chi tiết về thanh toán và hiệu suất:
 * - Breakdown theo trạng thái thanh toán
 * - Giá trị đơn hàng trung bình
 * - Tỷ lệ hoàn thành
 * - Tổng số tiền hoàn trả
 */

import { useMemo } from 'react'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, TrendingUp, RotateCcw, DollarSign } from 'lucide-react'
import { vnd } from '@/lib/utils/currency'

interface OrderStatsDetailProps {
  orders: OrderBookingDetail[]
  loading?: boolean
}

export function OrderStatsDetail({ orders, loading }: OrderStatsDetailProps) {
  const detailedStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        paid: 0,
        unpaid: 0,
        refunded: 0,
        avgOrderValue: 0,
        completionRate: 0,
        totalRefunded: 0,
      }
    }

    const paid = orders.filter((order) => order.paymentStatus === 'PAID').length
    const unpaid = orders.filter((order) => order.paymentStatus === 'UNPAID').length
    const refunded = orders.filter((order) => order.paymentStatus === 'REFUNDED').length

    const completedOrders = orders.filter((order) => order.status === 'COMPLETED')
    const totalRevenue = completedOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.totalAmount) || 0)
    }, 0)

    const totalRefundedAmount = orders
      .filter((order) => order.refundAmount && parseFloat(order.refundAmount) > 0)
      .reduce((sum, order) => {
        return sum + (parseFloat(order.refundAmount) || 0)
      }, 0)

    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0
    const completionRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0

    return {
      paid,
      unpaid,
      refunded,
      avgOrderValue,
      completionRate,
      totalRefunded: totalRefundedAmount,
    }
  }, [orders])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Payment Status Breakdown */}
      <Card className="border-2 border-emerald-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
            Trạng thái thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Đã thanh toán</span>
              <Badge variant="default" className="bg-green-500">
                {detailedStats.paid}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Chưa thanh toán</span>
              <Badge variant="secondary">
                {detailedStats.unpaid}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Đã hoàn tiền</span>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {detailedStats.refunded}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card className="border-2 border-indigo-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
            Giá trị TB/đơn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-indigo-600">
            {vnd(detailedStats.avgOrderValue)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Trung bình từ đơn hoàn tất
          </p>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="border-2 border-cyan-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-cyan-600" />
            </div>
            Tỷ lệ hoàn thành
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-cyan-600">
              {detailedStats.completionRate.toFixed(1)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(detailedStats.completionRate, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Refunded */}
      <Card className="border-2 border-rose-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="p-2 bg-rose-100 rounded-lg">
              <RotateCcw className="h-4 w-4 text-rose-600" />
            </div>
            Tổng tiền hoàn trả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-rose-600">
            {vnd(detailedStats.totalRefunded)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Từ các đơn đã hoàn tiền
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

