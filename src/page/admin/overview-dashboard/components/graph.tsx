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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { vnd } from '@/lib/utils/currency'

export default function Graph() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Get all orders (fetch multiple pages to get all data)
  const { data: ordersData } = useQuery({
    queryKey: ['all-orders-for-graph'],
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

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!ordersData) return []

    // Filter orders by selected month, year, and status (only completed orders)
    const filtered = ordersData.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return (
        order.status === 'COMPLETED' &&
        orderDate.getMonth() === selectedMonth &&
        orderDate.getFullYear() === selectedYear
      )
    })

    // Get all days in the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const monthData: Record<number, number> = {}

    // Initialize all days with 0
    for (let i = 1; i <= daysInMonth; i++) {
      monthData[i] = 0
    }

    // Sum sales by day (only completed orders)
    filtered.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      const day = orderDate.getDate()
      const amount = parseFloat(order.totalAmount) || 0
      monthData[day] = (monthData[day] || 0) + amount
    })

    // Convert to array format
    return Object.entries(monthData).map(([day, sales]) => ({
      day: parseInt(day),
      sales,
    }))
  }, [ordersData, selectedMonth, selectedYear])

  // Get month name
  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Chi tiết doanh thu</CardTitle>
          <div className="flex gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {new Date(selectedYear, i).toLocaleDateString('vi-VN', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickFormatter={(value) => `${value}`}
              label={{ value: 'Ngày', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
                return value.toString()
              }}
              label={{ value: 'Doanh số (VNĐ)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => [vnd(value), 'Doanh số']}
              labelFormatter={(label) => `Ngày ${label}`}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Thống kê doanh số theo ngày - {monthName}
        </p>
      </CardContent>
    </Card>
  )
}
