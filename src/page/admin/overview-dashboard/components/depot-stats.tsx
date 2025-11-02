/**
 * Component hiển thị Top 3 trạm được thuê nhiều nhất
 * 
 * Chức năng:
 * - Lấy toàn bộ đơn hàng từ API
 * - Đếm số lượt thuê theo từng trạm (depot)
 * - Sắp xếp và hiển thị top 3 trạm có số lượt thuê cao nhất
 * - Hiển thị thông tin: tên trạm, địa điểm, số lượt thuê
 * - Thể hiện ranking với icon và màu sắc khác nhau (vàng, xám, cam)
 * - Hiển thị progress bar so sánh với trạm đứng đầu
 * 
 * Props: Không có
 * Returns: JSX element hiển thị danh sách top 3 trạm
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderBookingAPI } from '@/apis/order-booking.api'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, TrendingUp } from 'lucide-react'

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

  // Calculate top 3 depots by rental count
  const topDepots = useMemo(() => {
    if (!allOrdersData) return []

    // Count rentals by depot
    const depotCounts: Record<string, { name: string; count: number; location: string }> = {}
    
    allOrdersData.forEach((order) => {
      const depotId = order.depotId
      const depotName = order.depot?.name || 'Unknown'
      const location = order.depot?.district && order.depot?.province 
        ? `${order.depot.district}, ${order.depot.province}` 
        : 'Unknown'
      
      if (!depotCounts[depotId]) {
        depotCounts[depotId] = { name: depotName, count: 0, location }
      }
      depotCounts[depotId].count++
    })

    // Sort by count and get top 3
    return Object.entries(depotCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [allOrdersData])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
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
        return 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
      case 3:
        return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Trạm được thuê nhiều nhất</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Xếp hạng theo số lượt thuê
        </p>
      </CardHeader>
      <CardContent>
        {topDepots.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topDepots.map((depot, index) => (
              <div
                key={depot.id}
                className="relative group"
              >
                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  index === 0 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50' :
                  index === 1 ? 'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100' :
                  'border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100'
                }`}>
                  {/* Rank Icon */}
                  <div className={`
                    flex items-center justify-center w-16 h-16 rounded-full font-bold text-2xl shadow-lg
                    ${getRankColor(index + 1)}
                  `}>
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Depot Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{depot.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {depot.count.toLocaleString()} lượt thuê
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {depot.location}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-24">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold">
                        {index === 0 ? '100%' : 
                         index === 1 ? `${Math.round((depot.count / topDepots[0].count) * 100)}%` :
                         `${Math.round((depot.count / topDepots[0].count) * 100)}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                          'bg-gradient-to-r from-orange-400 to-orange-600'
                        }`}
                        style={{ 
                          width: index === 0 ? '100%' : `${(depot.count / topDepots[0].count) * 100}%` 
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

