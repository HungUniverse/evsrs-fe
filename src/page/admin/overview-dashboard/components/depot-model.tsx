/**
 * Component hiển thị phân bố mẫu xe được thuê tại một trạm bằng Pie Chart
 * 
 * Chức năng:
 * - Lấy toàn bộ đơn hàng từ API
 * - Dropdown để chọn trạm
 * - Đếm số lượt thuê theo từng mẫu xe tại trạm được chọn
 * - Hiển thị phân bố bằng Pie Chart từ recharts
 * 
 * Props: Không có
 * Returns: JSX element hiển thị pie chart phân bố model tại trạm được chọn
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
import { MapPin, Car } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316', '#6366f1', '#14b8a6']

export default function DepotModel() {
  const [selectedDepotId, setSelectedDepotId] = useState<string>('')

  // Get all depots for dropdown
  const { data: depotsData } = useQuery({
    queryKey: ['depots-for-depot-model'],
    queryFn: async () => {
      const res = await depotAPI.getAll(1, 1000)
      const payload = res.data as ListBaseResponse<Depot>
      return payload.data.items || []
    },
  })

  // Set default depot to "Tan Binh" when depots data is loaded
  useEffect(() => {
    if (depotsData && depotsData.length > 0 && !selectedDepotId) {
      const tanBinhDepot = depotsData.find(depot => 
        depot.name.toLowerCase().includes('tan binh') || 
        depot.name.toLowerCase().includes('tân bình')
      )
      if (tanBinhDepot) {
        setSelectedDepotId(tanBinhDepot.id)
      }
    }
  }, [depotsData, selectedDepotId])

  // Get all orders
  const { data: allOrdersData } = useQuery({
    queryKey: ['all-orders-for-depot-model'],
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

  // Calculate model distribution for selected depot
  const chartData = useMemo(() => {
    if (!allOrdersData || !selectedDepotId) return []

    const selectedDepot = depotsData?.find(d => d.id === selectedDepotId)
    if (!selectedDepot) return []

    // Count rentals by model for selected depot
    const modelCounts: Record<string, { name: string; count: number }> = {}
    
    allOrdersData.forEach((order) => {
      // Only count completed orders from selected depot
      if (order.status !== 'COMPLETED' || order.depotId !== selectedDepotId) return
      
      if (order.carEvs?.model) {
        const modelId = order.carEvs.model.id
        const modelName = order.carEvs.model.modelName
        
        if (!modelCounts[modelId]) {
          modelCounts[modelId] = {
            name: modelName,
            count: 0
          }
        }
        modelCounts[modelId].count++
      }
    })

    // Convert to array and sort by count
    return Object.entries(modelCounts)
      .map(([id, data]) => ({
        id,
        name: data.name,
        value: data.count
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [allOrdersData, selectedDepotId, depotsData])

  const selectedDepot = depotsData?.find(d => d.id === selectedDepotId)

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Car className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Phân bố mẫu xe tại trạm</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Phân bố mẫu xe được thuê tại trạm được chọn
              </p>
            </div>
          </div>
          <Select value={selectedDepotId} onValueChange={setSelectedDepotId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Chọn trạm" />
            </SelectTrigger>
            <SelectContent>
              {depotsData?.map((depot) => (
                <SelectItem key={depot.id} value={depot.id}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{depot.name}</span>
                    {depot.district && depot.province && (
                      <span className="text-xs text-muted-foreground">
                        - {depot.district}, {depot.province}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedDepotId ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Vui lòng chọn trạm để xem phân bố mẫu xe</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Trạm {selectedDepot?.name} chưa có dữ liệu</p>
          </div>
        ) : (
          <>
            {selectedDepot && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{selectedDepot.name}</span>
                  {selectedDepot.district && selectedDepot.province && (
                    <span className="text-sm text-muted-foreground">
                      - {selectedDepot.district}, {selectedDepot.province}
                    </span>
                  )}
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    const p = percent || 0
                    if (p < 0.05) return '' // Hide labels for small slices
                    return `${name}: ${(p * 100).toFixed(0)}%`
                  }}
                  outerRadius={120}
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
                  height={72}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(_value, entry: any) => (
                    <span style={{ color: entry.color }}>
                      {entry.payload?.name}: {entry.payload?.value?.toLocaleString()} lượt
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

