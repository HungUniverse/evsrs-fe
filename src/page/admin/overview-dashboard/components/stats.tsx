import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserFullAPI } from '@/apis/user.api'
import { orderBookingAPI } from '@/apis/order-booking.api'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Package, TrendingDown, Clock } from 'lucide-react'
import { vnd } from '@/lib/utils/currency'
import type { OrderBookingDetail } from '@/@types/order/order-booking'
import type { UserFull } from '@/@types/auth.type'

export default function Stats() {
  // Get all users to filter customers (role === "USER")
  const { data: allUsersData } = useQuery<UserFull[]>({
    queryKey: ['all-users-for-customers'],
    queryFn: async (): Promise<UserFull[]> => {
      let allItems: UserFull[] = []
      let pageNumber = 1
      let hasMore = true
      
      while (hasMore) {
        const response = await UserFullAPI.getAll(pageNumber, 1000)
        const items = response.data.data.items
        allItems = [...allItems, ...items]
        
        hasMore = pageNumber < response.data.data.totalPages
        pageNumber++
      }
      
      return allItems
    },
  })

  // Calculate total customers (users with role "USER")
  const usersData = useMemo(() => {
    if (!allUsersData) return undefined
    return allUsersData.filter(user => user.role === 'USER').length
  }, [allUsersData])

  // Get all orders (only fetch totalCount)
  const { data: ordersData } = useQuery({
    queryKey: ['total-orders'],
    queryFn: async () => {
      const response = await orderBookingAPI.getAll({ pageSize: 1 })
      return response.data.data.totalCount
    },
  })

  // Get all orders (fetch multiple pages to get all data for filtering)
  const { data: allOrdersData } = useQuery({
    queryKey: ['all-orders-for-filtering'],
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

  // Calculate total sales from completed orders only
  const totalSales = useMemo(() => {
    if (!allOrdersData) return 0
    return allOrdersData
      .filter((order) => order.status === 'COMPLETED')
      .reduce((sum, order) => {
        const amount = parseFloat(order.totalAmount) || 0
        return sum + amount
      }, 0)
  }, [allOrdersData])

  // Calculate pending orders - filter from allOrdersData by status
  const pendingOrdersData = useMemo(() => {
    if (!allOrdersData) return 0
    return allOrdersData.filter((order) => order.status === 'PENDING').length
  }, [allOrdersData])

  const stats = [
    {
      title: 'Tổng khách hàng',
      value: usersData?.toLocaleString() || '0',
      icon: Users,
      iconColor: 'bg-purple-500',
    },
    {
      title: 'Tổng đơn hàng',
      value: ordersData?.toLocaleString() || '0',
      icon: Package,
      iconColor: 'bg-yellow-500',
    },
    {
      title: 'Tổng doanh thu',
      value: vnd(totalSales),
      icon: TrendingDown,
      iconColor: 'bg-green-500',
    },
    {
      title: 'Đang chờ xử lý',
      value: pendingOrdersData?.toLocaleString() || '0',
      icon: Clock,
      iconColor: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.iconColor} rounded-full p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}