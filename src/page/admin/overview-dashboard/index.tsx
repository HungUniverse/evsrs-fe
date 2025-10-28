import Stats from './components/stats'
import Graph from './components/graph'

export default function OverviewDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">Tổng quan về hệ thống</p>
      </div>
      
      <Stats />
      <Graph />
    </div>
  )
}
