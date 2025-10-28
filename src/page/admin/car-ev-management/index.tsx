import React from 'react'
import CarEVTable from './components/table'

export default function CarEVManagementPage() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Quản lý xe điện</h1>
        <p className="text-sm text-muted-foreground">Quản lý xe điện để quản lý các xe điện trên hệ thống.</p>
      </div>
      {/* <CarEVStats /> */}
      <CarEVTable />
    </div>
  )
}
