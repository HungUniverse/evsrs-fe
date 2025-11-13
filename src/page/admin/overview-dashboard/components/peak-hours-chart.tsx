/**
 * Component hiển thị thống kê giờ cao điểm
 * - Lấy tất cả đơn hàng (all status) vì chỉ quan tâm số lượng đơn được đặt
 * - Có filter theo depot hoặc tất cả depot
 * - Hiển thị số lượng đơn theo giờ trong ngày
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDate } from '@/lib/utils/formatDate'
import { Clock, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Helper function to convert date to Vietnam timezone (UTC+7)
function toVietnamTime(date: Date): Date {
  // Get timezone offset in minutes (VN is UTC+7 = 420 minutes)
  const vnOffset = 7 * 60 // UTC+7 in minutes
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(utcTime + (vnOffset * 60000))
}

export default function PeakHoursChart() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDepotId, setSelectedDepotId] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Get all depots for filter
  const { data: depotsData } = useQuery({
    queryKey: ['depots-for-peak-hours'],
    queryFn: async () => {
      const res = await depotAPI.getAll(1, 1000)
      const payload = res.data as ListBaseResponse<Depot>
      return payload.data.items || []
    },
  })

  // Get all orders (fetch multiple pages to get all data)
  // Note: This chart uses ALL statuses, not just COMPLETED
  const { data: ordersData } = useQuery({
    queryKey: ['all-orders-for-peak-hours'],
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

  // Update currentDate when month/year changes
  useEffect(() => {
    const today = new Date()
    const todayVn = toVietnamTime(today)
    
    // If selected month/year matches today, use today's date, otherwise use first day
    if (todayVn.getMonth() === selectedMonth && todayVn.getFullYear() === selectedYear) {
      // Use today's date if it's in the selected month/year
      setCurrentDate(new Date(selectedYear, selectedMonth, todayVn.getDate()))
    } else {
      // Otherwise use first day of month
      setCurrentDate(new Date(selectedYear, selectedMonth, 1))
    }
  }, [selectedMonth, selectedYear])

  // Prepare chart data - count orders by hour for the selected date
  const chartData = useMemo(() => {
    if (!ordersData || !currentDate) return []

    // Filter orders by depot, month, year, and selected date
    const filtered = ordersData.filter((order) => {
      // Filter by depot
      if (selectedDepotId !== 'all' && order.depotId !== selectedDepotId) {
        return false
      }

      // Convert to Vietnam timezone (UTC+7)
      const orderDate = new Date(order.createdAt)
      const vnDate = toVietnamTime(orderDate)
      
      // Filter by month and year
      if (vnDate.getMonth() !== selectedMonth || vnDate.getFullYear() !== selectedYear) {
        return false
      }

      // Filter by selected date (compare dates directly in Vietnam timezone)
      const currentVnDate = toVietnamTime(currentDate)
      
      return (
        vnDate.getDate() === currentVnDate.getDate() &&
        vnDate.getMonth() === currentVnDate.getMonth() &&
        vnDate.getFullYear() === currentVnDate.getFullYear()
      )
    })

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
      hourData[hour] = (hourData[hour] || 0) + 1
    })

    // Format hours for display (06, 09, 12, 15, 18, 21)
    return Object.entries(hourData).map(([hour, count]) => ({
      hour: `${parseInt(hour).toString().padStart(2, '0')} giờ`,
      hourNum: parseInt(hour),
      count,
    }))
  }, [ordersData, selectedDepotId, currentDate, selectedMonth, selectedYear])

  const selectedDepotName = selectedDepotId === 'all' 
    ? 'Tất cả trạm' 
    : depotsData?.find(d => d.id === selectedDepotId)?.name || 'Tất cả trạm'

  const formatDateDisplay = (date: Date) => {
    // Convert to ISO string for formatDate function
    const isoString = date.toISOString()
    // Use formatDate from lib but only get date part (remove time)
    const formatted = formatDate(isoString)
    // Extract date part (before the time)
    return formatted.split(' ')[0]
  }

  const handlePreviousDate = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    // Check if still in selected month/year
    if (newDate.getMonth() === selectedMonth && newDate.getFullYear() === selectedYear) {
      setCurrentDate(newDate)
    }
  }

  const handleNextDate = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    // Check if still in selected month/year
    if (newDate.getMonth() === selectedMonth && newDate.getFullYear() === selectedYear) {
      setCurrentDate(newDate)
    }
  }

  // Check if navigation buttons should be disabled
  const canGoPrevious = () => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1)
    return currentDate.getTime() > firstDayOfMonth.getTime()
  }

  const canGoNext = () => {
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0)
    return currentDate.getTime() < lastDayOfMonth.getTime()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Giờ đông khách</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Month Select */}
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => {
                setSelectedMonth(parseInt(value))
                // Reset to first day of month
                setCurrentDate(new Date(selectedYear, parseInt(value), 1))
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

            {/* Year Select */}
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => {
                setSelectedYear(parseInt(value))
                // Reset to first day of month
                setCurrentDate(new Date(parseInt(value), selectedMonth, 1))
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
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-muted-foreground">
            {selectedDepotName} - {new Date(selectedYear, selectedMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDate}
              disabled={!canGoPrevious()}
            >
              ←
            </Button>
            <span className="text-sm text-muted-foreground min-w-[100px] text-center">
              {formatDateDisplay(currentDate)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDate}
              disabled={!canGoNext()}
            >
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              tickFormatter={(value) => value}
              label={{ value: 'Giờ', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Số lượng đơn', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => [value, 'Số đơn']}
              labelFormatter={(label) => label}
            />
            <Bar 
              dataKey="count" 
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Thống kê số lượng đơn hàng theo giờ - {formatDateDisplay(currentDate)}
        </p>
      </CardContent>
    </Card>
  )
}

