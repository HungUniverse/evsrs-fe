/**
 * Component tích hợp hiển thị doanh thu theo giờ/ngày/tháng
 * - Có filter theo depot hoặc tất cả depot
 * - Chỉ lấy đơn có status = COMPLETED
 */

import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderBookingAPI } from '@/apis/order-booking.api'
import { depotAPI } from '@/apis/depot.api'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import type { Depot } from '@/@types/car/depot'
import type { ListBaseResponse } from '@/@types/response'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { vnd } from '@/lib/utils/currency'
import { DollarSign } from 'lucide-react'

type TimeRange = 'hour' | 'day' | 'month'

// Helper function to convert date to Vietnam timezone (UTC+7)
function toVietnamTime(date: Date): Date {
  // Get timezone offset in minutes (VN is UTC+7 = 420 minutes)
  const vnOffset = 7 * 60 // UTC+7 in minutes
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(utcTime + (vnOffset * 60000))
}

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('day')
  const [selectedDepotId, setSelectedDepotId] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())

  // Ensure selectedDay is valid when month/year changes
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth)
    }
  }, [selectedMonth, selectedYear, selectedDay])

  // Get all depots for filter
  const { data: depotsData } = useQuery({
    queryKey: ['depots-for-revenue-chart'],
    queryFn: async () => {
      const res = await depotAPI.getAll(1, 1000)
      const payload = res.data as ListBaseResponse<Depot>
      return payload.data.items || []
    },
  })

  // Get all orders (fetch multiple pages to get all data)
  const { data: ordersData } = useQuery({
    queryKey: ['all-orders-for-revenue-chart'],
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

  // Prepare chart data based on time range
  const chartData = useMemo(() => {
    if (!ordersData) return []

    // Filter orders by status (only COMPLETED), depot, and time range
    const filtered = ordersData.filter((order) => {
      // Only completed orders
      if (order.status !== 'COMPLETED') return false

      // Filter by depot
      if (selectedDepotId !== 'all' && order.depotId !== selectedDepotId) {
        return false
      }

      // Convert to Vietnam timezone (UTC+7)
      const orderDate = new Date(order.createdAt)
      const vnDate = toVietnamTime(orderDate)
      
      // Filter by time range
      if (timeRange === 'hour') {
        // For hourly, show data for selected day, month, and year
        return (
          vnDate.getDate() === selectedDay &&
          vnDate.getMonth() === selectedMonth &&
          vnDate.getFullYear() === selectedYear
        )
      } else if (timeRange === 'day') {
        // For daily, show data for selected month
        return (
          vnDate.getMonth() === selectedMonth &&
          vnDate.getFullYear() === selectedYear
        )
      } else if (timeRange === 'month') {
        // For monthly, show data for selected year
        return vnDate.getFullYear() === selectedYear
      }

      return false
    })

    if (timeRange === 'hour') {
      // Group by hour (0-23)
      const hourData: Record<number, number> = {}
      for (let i = 0; i < 24; i++) {
        hourData[i] = 0
      }

      filtered.forEach((order) => {
        // Convert to Vietnam timezone (UTC+7)
        const orderDate = new Date(order.createdAt)
        const vnDate = toVietnamTime(orderDate)
        const hour = vnDate.getHours()
        const amount = parseFloat(order.totalAmount) || 0
        hourData[hour] = (hourData[hour] || 0) + amount
      })

      return Object.entries(hourData).map(([hour, sales]) => ({
        label: `${hour} giờ`,
        sales,
      }))
    } else if (timeRange === 'day') {
      // Group by day
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
      const dayData: Record<number, number> = {}

      for (let i = 1; i <= daysInMonth; i++) {
        dayData[i] = 0
      }

      filtered.forEach((order) => {
        // Convert to Vietnam timezone (UTC+7)
        const orderDate = new Date(order.createdAt)
        const vnDate = toVietnamTime(orderDate)
        const day = vnDate.getDate()
        const amount = parseFloat(order.totalAmount) || 0
        dayData[day] = (dayData[day] || 0) + amount
      })

      return Object.entries(dayData).map(([day, sales]) => ({
        label: parseInt(day),
        sales,
      }))
    } else {
      // Group by month
      const monthData: Record<number, number> = {}
      for (let i = 0; i < 12; i++) {
        monthData[i] = 0
      }

      filtered.forEach((order) => {
        // Convert to Vietnam timezone (UTC+7)
        const orderDate = new Date(order.createdAt)
        const vnDate = toVietnamTime(orderDate)
        const month = vnDate.getMonth()
        const amount = parseFloat(order.totalAmount) || 0
        monthData[month] = (monthData[month] || 0) + amount
      })

      return Object.entries(monthData).map(([month, sales]) => ({
        label: new Date(selectedYear, parseInt(month)).toLocaleDateString('vi-VN', { month: 'short' }),
        sales,
      }))
    }
  }, [ordersData, timeRange, selectedDepotId, selectedMonth, selectedYear, selectedDay])

  const title = 'Doanh thu theo ' + (timeRange === 'hour' ? 'giờ' : timeRange === 'day' ? 'ngày' : 'tháng')
  const selectedDepotName = selectedDepotId === 'all' 
    ? 'Tất cả trạm' 
    : depotsData?.find(d => d.id === selectedDepotId)?.name || 'Tất cả trạm'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Time Range Select */}
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as TimeRange)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Theo giờ</SelectItem>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
              </SelectContent>
            </Select>

            {/* Depot Filter */}
            <Select
              value={selectedDepotId}
              onValueChange={setSelectedDepotId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn trạm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạm</SelectItem>
                {depotsData?.map((depot) => (
                  <SelectItem key={depot.id} value={depot.id}>
                    {depot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Day, Month, Year Select (for hour) */}
            {timeRange === 'hour' && (
              <>
                <Select
                  value={selectedDay.toString()}
                  onValueChange={(value) => {
                    const day = parseInt(value)
                    setSelectedDay(day)
                    // Ensure day is valid for the selected month
                    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
                    if (day > daysInMonth) {
                      setSelectedDay(daysInMonth)
                    }
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Chọn ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: new Date(selectedYear, selectedMonth + 1, 0).getDate() }, (_, i) => {
                      const day = i + 1
                      return (
                        <SelectItem key={day} value={day.toString()}>
                          Ngày {day}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => {
                    const month = parseInt(value)
                    setSelectedMonth(month)
                    // Reset day if it's invalid for new month
                    const daysInMonth = new Date(selectedYear, month + 1, 0).getDate()
                    if (selectedDay > daysInMonth) {
                      setSelectedDay(daysInMonth)
                    }
                  }}
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
                  onValueChange={(value) => {
                    const year = parseInt(value)
                    setSelectedYear(year)
                    // Reset day if it's invalid for new year/month
                    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate()
                    if (selectedDay > daysInMonth) {
                      setSelectedDay(daysInMonth)
                    }
                  }}
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
              </>
            )}

            {/* Month and Year Select (for day) */}
            {timeRange === 'day' && (
              <>
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
              </>
            )}

            {/* Year Select (for month) */}
            {timeRange === 'month' && (
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
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedDepotName} - {timeRange === 'hour' 
            ? `Ngày ${selectedDay} ${new Date(selectedYear, selectedMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`
            : timeRange === 'day'
            ? new Date(selectedYear, selectedMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
            : `Năm ${selectedYear}`}
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {timeRange === 'month' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
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
              <Bar 
                dataKey="sales" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickFormatter={(value) => `${value}`}
                label={{ 
                  value: timeRange === 'hour' ? 'Giờ' : 'Ngày', 
                  position: 'insideBottom', 
                  offset: -5 
                }}
              />
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`
                  return value.toString()
                }}
                label={{ value: 'Doanh thu (VNĐ)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => [vnd(value), 'Doanh thu']}
                labelFormatter={(label) => timeRange === 'hour' ? label : `Ngày ${label}`}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

