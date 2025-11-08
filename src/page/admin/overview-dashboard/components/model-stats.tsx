/**
 * Component hiển thị Top 3 loại xe (model) được thuê nhiều nhất
 * 
 * Chức năng:
 * - Lấy toàn bộ đơn hàng từ API
 * - Đếm số lượt thuê theo từng model xe
 * - Tính tổng doanh thu từ mỗi model
 * - Sắp xếp và hiển thị top 3 model có số lượt thuê cao nhất
 * - Hiển thị thông tin: hình ảnh xe, tên model, số lượt thuê, tổng doanh thu
 * - Hiển thị thông số kỹ thuật: dung lượng pin (kWh), phạm vi hoạt động (km)
 * - Thể hiện ranking với icon và màu sắc khác nhau (xanh, indigo, tím)
 * - Hiển thị progress bar so sánh với model đứng đầu
 * 
 * Props: Không có
 * Returns: JSX element hiển thị danh sách top 3 model xe
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderBookingAPI } from '@/apis/order-booking.api'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, TrendingUp, Battery, Zap } from 'lucide-react'
import { vnd } from '@/lib/utils/currency'

export default function ModelStats() {
  // Get all orders
  const { data: allOrdersData } = useQuery({
    queryKey: ['all-orders-for-model-stats'],
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

  // Calculate top 3 car models by rental count
  const topModels = useMemo(() => {
    if (!allOrdersData) return []

    // Count rentals by model
    const modelCounts: Record<string, { 
      name: string
      count: number
      revenue: number
      battery: string
      range: string
      image: string
    }> = {}
    
    allOrdersData.forEach((order) => {
      if (order.carEvs?.model) {
        const modelId = order.carEvs.model.id
        const model = order.carEvs.model
        
        if (!modelCounts[modelId]) {
          modelCounts[modelId] = { 
            name: model.modelName,
            count: 0,
            revenue: 0,
            battery: model.batteryCapacityKwh,
            range: model.rangeKm,
            image: model.image
          }
        }
        // Only count and calculate revenue for completed orders
        if (order.status === 'COMPLETED') {
          modelCounts[modelId].count++
          modelCounts[modelId].revenue += parseFloat(order.totalAmount) || 0
        }
      }
    })

    // Sort by count, filter out models with 0 rentals or 0 revenue, and get top 3
    return Object.entries(modelCounts)
      .map(([id, data]) => ({ id, ...data }))
      .filter((model) => model.count > 0 && model.revenue > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [allOrdersData])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🏆'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return '🏅'
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
      case 2:
        return 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white'
      case 3:
        return 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Car className="h-5 w-5 text-indigo-600" />
          </div>
          <CardTitle className="text-xl">Mẫu xe được thuê nhiều nhất</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Xếp hạng theo số lượt thuê và doanh thu
        </p>
      </CardHeader>
      <CardContent>
        {topModels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topModels.map((model, index) => (
              <div
                key={model.id}
                className="relative group"
              >
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  index === 0 ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100' :
                  index === 1 ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 to-indigo-100' :
                  'border-purple-400 bg-gradient-to-r from-purple-50 to-purple-100'
                }`}>
                  {/* Rank Badge */}
                  <div className={`
                    flex flex-col items-center justify-center w-20 h-20 rounded-full font-bold shadow-lg
                    ${getRankColor(index + 1)}
                  `}>
                    <span className="text-3xl">{getRankIcon(index + 1)}</span>
                    <span className="text-xs mt-0.5">#{index + 1}</span>
                  </div>

                  {/* Model Image */}
                  <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                    <img 
                      src={model.image || '/placeholder-car.png'} 
                      alt={model.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%%25" y="50%%25" text-anchor="middle" dy=".3em" fill="%23999"%3ECar%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>

                  {/* Model Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {model.count.toLocaleString()} lượt thuê
                      </Badge>
                      <Badge variant="outline" className="text-xs text-green-600">
                        {vnd(model.revenue)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3" />
                        <span>{model.battery} kWh</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>{model.range} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-24">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold">
                        {index === 0 ? '100%' : 
                         index === 1 ? `${Math.round((model.count / topModels[0].count) * 100)}%` :
                         `${Math.round((model.count / topModels[0].count) * 100)}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
                          index === 1 ? 'bg-gradient-to-r from-indigo-500 to-indigo-700' :
                          'bg-gradient-to-r from-purple-500 to-purple-700'
                        }`}
                        style={{ 
                          width: index === 0 ? '100%' : `${(model.count / topModels[0].count) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

