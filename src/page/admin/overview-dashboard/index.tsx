/**
 * Dashboard tổng quan cho Admin
 * 
 * Layout:
 * 1. Stats - 4 thẻ thống kê tổng quan (khách hàng, đơn hàng, doanh thu, pending)
 * 2. RevenueChart - Biểu đồ doanh thu tích hợp (giờ/ngày/tháng) với filter depot
 * 3. PeakHoursChart - Thống kê giờ cao điểm (all status) với filter depot
 * 4. Top 3 Depot & Model - Grid 2 cột hiển thị top trạm và top model
 * 5. Depot Model - Model xe phổ biến tại từng trạm (đầy chiều rộng)
 */

import Stats from './components/stats'
import RevenueChart from './components/revenue-chart'
import PeakHoursChart from './components/peak-hours-chart'
import DepotStats from './components/depot-stats'
import ModelStats from './components/model-stats'
import DepotModel from './components/depot-model'
import CapacityAdvice from './components/capacity-advice'

export default function OverviewDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">Tổng quan về hệ thống</p>
      </div>
      
      <Stats />
      <RevenueChart />
      <PeakHoursChart />
      
      <CapacityAdvice />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <DepotStats />
        <ModelStats />
      </div>
      
      <DepotModel />
    </div>
  )
}
