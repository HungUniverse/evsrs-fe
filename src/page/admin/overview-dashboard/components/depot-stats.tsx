/**
 * Component hiển thị phân bố trạm được thuê bằng Pie Chart
 * 
 * Chức năng:
 * - Lấy toàn bộ đơn hàng từ API
 * - Đếm số lượt thuê theo từng trạm (depot)
 * - Hiển thị phân bố bằng Pie Chart từ recharts
 * 
 * Props: Không có
 * Returns: JSX element hiển thị pie chart phân bố trạm
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderBookingAPI } from '@/apis/order-booking.api'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316']

export default function DepotStats() {
  // Get all orders
  const { data: allOrdersData } = useQuery({
    queryKey: ['all-orders-for-depot-stats'],
    queryFn: async () => {
      let allItems: OrderBookingDetail[] = []
      let pageNumber = 1
      let hasMore = true
      
      while (hasMore) {
        const response = await orderBookingAPI.getAll({ 
          pageNumber,
          pageSize: 1000 
        })
        const items = response.data.data.items
        allItems = [...allItems, ...items]
        
        hasMore = pageNumber < response.data.data.totalPages
        pageNumber++
      }
      
      return allItems
    },
  })

  // Calculate depot distribution for pie chart
  const chartData = useMemo(() => {
    if (!allOrdersData) return []

    // Count rentals by depot (only completed orders)
    const depotCounts: Record<string, { name: string; count: number }> = {}
    
    allOrdersData.forEach((order) => {
      // Only count completed orders
      if (order.status !== 'COMPLETED') return
      
      const depotId = order.depotId
      const depotName = order.depot?.name || 'Unknown'
      
      if (!depotCounts[depotId]) {
        depotCounts[depotId] = { name: depotName, count: 0 }
      }
      depotCounts[depotId].count++
    })

    // Convert to array and sort by count
    return Object.entries(depotCounts)
      .map(([id, data]) => ({ 
        id,
        name: data.name, 
        value: data.count 
      }))
      .filter((depot) => depot.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [allOrdersData])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string; value: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const total = chartData.reduce((sum, item) => sum + item.value, 0)
      const percentage = ((data.value / total) * 100).toFixed(1)
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.payload.name}</p>
          <p className="text-sm text-blue-600">
            {data.value.toLocaleString()} lượt thuê ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Phân bố trạm được thuê</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Phân bố số lượt thuê theo trạm
        </p>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có dữ liệu</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(_value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {entry.payload?.name}: {entry.payload?.value?.toLocaleString()} lượt
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

