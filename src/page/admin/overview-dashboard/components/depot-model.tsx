/**
 * Component hiển thị model xe được thuê nhiều nhất tại từng trạm
 * 
 * Chức năng:
 * - Lấy toàn bộ đơn hàng từ API
 * - Đếm số lượt thuê theo từng cặp (trạm, model)
 * - Tìm model được thuê nhiều nhất tại mỗi trạm
 * - Hiển thị thông tin: tên trạm, địa điểm, model xe phổ biến nhất
 * - Hiển thị hình ảnh model xe
 * - Sắp xếp theo số lượt thuê giảm dần
 * - Mỗi card trạm có gradient màu sắc khác nhau
 * - Layout grid 2 cột responsive
 * 
 * Props: Không có
 * Returns: JSX element hiển thị danh sách model phổ biến theo trạm
 */

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { orderBookingAPI } from '@/apis/order-booking.api'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Car } from 'lucide-react'

export default function DepotModel() {
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

  // Calculate most rented model per depot
  const depotModels = useMemo(() => {
    if (!allOrdersData) return []

    // Count rentals by depot and model
    const depotModelCounts: Record<string, {
      depotName: string
      location: string
      models: Record<string, { name: string; count: number; image: string }>
    }> = {}
    
    allOrdersData.forEach((order) => {
      // Only count completed orders
      if (order.status !== 'COMPLETED') return
      
      if (order.depot && order.carEvs?.model) {
        const depotId = order.depotId
        const depotName = order.depot.name
        const location = `${order.depot.district}, ${order.depot.province}`
        const modelId = order.carEvs.model.id
        const modelName = order.carEvs.model.modelName
        const modelImage = order.carEvs.model.image
        
        if (!depotModelCounts[depotId]) {
          depotModelCounts[depotId] = {
            depotName,
            location,
            models: {}
          }
        }
        
        if (!depotModelCounts[depotId].models[modelId]) {
          depotModelCounts[depotId].models[modelId] = {
            name: modelName,
            count: 0,
            image: modelImage
          }
        }
        depotModelCounts[depotId].models[modelId].count++
      }
    })

    // Find top model for each depot, filter out depots with 0 rentals
    return Object.entries(depotModelCounts)
      .map(([depotId, data]) => {
        const topModel = Object.entries(data.models)
          .sort(([, a], [, b]) => b.count - a.count)[0]
        
        if (!topModel || topModel[1].count === 0) return null
        
        return {
          depotId,
          depotName: data.depotName,
          location: data.location,
          modelName: topModel[1].name,
          modelImage: topModel[1].image,
          count: topModel[1].count
        }
      })
      .filter(item => item !== null && item.count > 0)
      .sort((a, b) => (b?.count || 0) - (a?.count || 0))
  }, [allOrdersData])

  // Get gradient colors
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500'
  ]

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Car className="h-5 w-5 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Mẫu xe được thuê nhiều nhất tại mỗi trạm</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Mẫu xe được thuê nhiều nhất tại mỗi trạm
        </p>
      </CardHeader>
      <CardContent>
        {depotModels.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {depotModels.map((item, index) => {
              if (!item) return null
              
              const gradient = gradients[index % gradients.length]
              
              return (
                <div
                  key={item.depotId}
                  className="relative group overflow-hidden rounded-xl border-2 border-gray-200 hover:border-primary transition-all hover:shadow-xl"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative p-4">
                    {/* Depot Info Header */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`p-1.5 bg-gradient-to-br ${gradient} rounded-lg`}>
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base leading-tight">{item.depotName}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Model Info */}
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                      {/* Model Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shadow-md flex-shrink-0">
                        <img 
                          src={item.modelImage || '/placeholder-car.png'} 
                          alt={item.modelName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%%25" y="50%%25" text-anchor="middle" dy=".3em" fill="%23999"%3ECar%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      </div>

                      {/* Model Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Car className="h-4 w-4 text-primary" />
                          <p className="font-semibold text-sm truncate">{item.modelName}</p>
                        </div>
                        <Badge className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                          {item.count.toLocaleString()} lượt thuê
                        </Badge>
                      </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full`} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

