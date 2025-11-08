/**
 * Component hiển thị doanh thu theo từng trạm theo tháng
 * 
 * Chức năng:
 * - Lấy toàn bộ đơn hàng từ API và lọc theo năm được chọn
 * - Tính doanh thu cho từng trạm theo từng tháng trong năm
 * - Hiển thị biểu đồ cột (Bar Chart) với màu sắc khác nhau cho mỗi trạm
 * - Cho phép chọn năm để xem dữ liệu (5 năm gần nhất)
 * - Mỗi trạm có màu riêng để dễ phân biệt
 * - Hiển thị legend với tên các trạm
 * - Tooltip hiển thị giá trị doanh thu khi hover
 * - Sử dụng thư viện Recharts để vẽ biểu đồ
 * 
 * Props: Không có
 * Returns: JSX element hiển thị biểu đồ doanh thu
 */

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderBookingAPI } from '@/apis/order-booking.api'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { vnd } from '@/lib/utils/currency'
import { DollarSign } from 'lucide-react'

export default function DepotRevenue() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Get all orders
  const { data: allOrdersData } = useQuery({
    queryKey: ['all-orders-for-depot-revenue'],
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

  // Prepare chart data - revenue by depot per month
  const chartData = useMemo(() => {
    if (!allOrdersData) return []

    // Filter orders by selected year and status (only completed orders)
    const filtered = allOrdersData.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return (
        order.status === 'COMPLETED' &&
        orderDate.getFullYear() === selectedYear
      )
    })

    // Get unique depots from orders
    const uniqueDepots = new Map<string, { name: string }>()
    filtered.forEach((order) => {
      if (order.depot && !uniqueDepots.has(order.depotId)) {
        uniqueDepots.set(order.depotId, { name: order.depot.name })
      }
    })

    // Initialize data structure for 12 months
    const monthlyData: Record<string, Record<number, number>> = {}
    uniqueDepots.forEach((_depot, depotId) => {
      monthlyData[depotId] = {}
      for (let month = 0; month < 12; month++) {
        monthlyData[depotId][month] = 0
      }
    })

    // Calculate revenue per depot per month (only completed orders)
    filtered.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      const month = orderDate.getMonth()
      const depotId = order.depotId
      const amount = parseFloat(order.totalAmount) || 0
      
      if (monthlyData[depotId]) {
        monthlyData[depotId][month] = (monthlyData[depotId][month] || 0) + amount
      }
    })

    // Convert to array format for chart
    const result: Record<string, number | string>[] = []
    for (let month = 0; month < 12; month++) {
      const monthName = new Date(selectedYear, month).toLocaleDateString('vi-VN', { month: 'short' })
      const entry: Record<string, number | string> = { month: monthName }
      
      uniqueDepots.forEach((depot, depotId) => {
        entry[depot.name] = monthlyData[depotId][month]
      })
      
      result.push(entry)
    }

    return result
  }, [allOrdersData, selectedYear])

  // Get color palette
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
  ]

  // Get depot names for legend (only depots with revenue in selected year)
  const depotNames = useMemo(() => {
    if (!allOrdersData) return []
    
    // Get depots that have revenue in the selected year
    const depotsWithRevenue = new Map<string, string>()
    const filtered = allOrdersData.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return (
        order.status === 'COMPLETED' &&
        orderDate.getFullYear() === selectedYear
      )
    })
    
    filtered.forEach((order) => {
      if (order.depot && !depotsWithRevenue.has(order.depotId)) {
        depotsWithRevenue.set(order.depotId, order.depot.name)
      }
    })
    
    return Array.from(depotsWithRevenue.values())
  }, [allOrdersData, selectedYear])

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-xl">Doanh Thu Theo Trạm</CardTitle>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 4 + i
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Chi tiết doanh thu từng trạm theo tháng
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => value}
              label={{ value: 'Tháng', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
                return value.toString()
              }}
              label={{ value: 'Doanh thu (VNĐ)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => [vnd(value), 'Doanh thu']}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            {depotNames.map((name, index) => (
              <Bar 
                key={name}
                dataKey={name} 
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                name={name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Thống kê doanh thu theo tháng - Năm {selectedYear}
        </p>
      </CardContent>
    </Card>
  )
}

