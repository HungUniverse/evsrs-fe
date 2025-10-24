import CarManufactureTable from './components/table'

export default function CarManufactureManagementPage() {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Quản lý nhà sản xuất xe</h1>
        <p className="text-sm text-muted-foreground">Quản lý nhà sản xuất xe để quản lý các hãng xe trên hệ thống.</p>
      </div>
      <CarManufactureTable/>
    </div>
  )
}
