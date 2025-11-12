/**
 * Order Statistics Component
 * 
 * Hiển thị thống kê tổng quan về đơn đặt xe:
 * - Tổng số đơn hàng
 * - Đơn hoàn tất (COMPLETED)
 * - Đơn đã hủy (CANCELLED)  
 * - Đơn đang xử lý (PENDING/CONFIRMED/IN_PROGRESS)
 * - Tổng doanh thu từ đơn hoàn tất
 */

import { useMemo } from 'react'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent } from '@/components/ui/card'
import { Package, CheckCircle2, XCircle, Clock, Banknote } from 'lucide-react'
import { vnd } from '@/lib/utils/currency'

interface OrderStatsProps {
  orders: OrderBookingDetail[]
  loading?: boolean
}

export function OrderStats({ orders, loading }: OrderStatsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        total: 0,
        completed: 0,
        cancelled: 0,
        processing: 0,
        revenue: 0,
      }
    }

    const completed = orders.filter((order) => order.status === 'COMPLETED')
    const cancelled = orders.filter((order) => order.status === 'CANCELLED')
    const processing = orders.filter((order) => 
      ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(order.status)
    )

    const revenue = completed.reduce((sum, order) => {
      const amount = parseFloat(order.totalAmount) || 0
      return sum + amount
    }, 0)

    return {
      total: orders.length,
      completed: completed.length,
      cancelled: cancelled.length,
      processing: processing.length,
      revenue,
    }
  }, [orders])

  const statsConfig = [
    {
      title: 'Tổng đơn hàng',
      value: stats.total.toLocaleString(),
      icon: Package,
      iconColor: 'bg-blue-500',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Đơn hoàn tất',
      value: stats.completed.toLocaleString(),
      icon: CheckCircle2,
      iconColor: 'bg-green-500',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      title: 'Đơn đã hủy',
      value: stats.cancelled.toLocaleString(),
      icon: XCircle,
      iconColor: 'bg-red-500',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
    },
    {
      title: 'Đang xử lý',
      value: stats.processing.toLocaleString(),
      icon: Clock,
      iconColor: 'bg-amber-500',
      bgGradient: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Tổng doanh thu',
      value: vnd(stats.revenue),
      icon: Banknote,
      iconColor: 'bg-purple-500',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statsConfig.map((stat) => {
        const Icon = stat.icon

        return (
          <Card 
            key={stat.title}
            className={`border-2 ${stat.borderColor} bg-gradient-to-br ${stat.bgGradient} hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.iconColor} rounded-full p-3 shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

