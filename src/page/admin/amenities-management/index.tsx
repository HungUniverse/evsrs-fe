import React from 'react'
import AmenitiesTable from './components/table'

export default function AmenitiesManagementPage() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Quản lý tiện ích</h1>
        <p className="text-sm text-muted-foreground">Quản lý tiện ích khả dụng trên xe ô tô.</p>
      </div>
      <AmenitiesTable />
    </div>
  )
}
