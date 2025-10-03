import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, Filter, Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarModel, setSelectedCarModel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');

  const stats = [
    { label: 'Tổng số xe', value: '156', color: 'text-emerald-600' },
    { label: 'Đơn hàng hôm nay', value: '23', color: 'text-emerald-600' },
    { label: 'Khách hàng', value: '1,247', color: 'text-emerald-600' },
    { label: 'Doanh thu tháng', value: '₫45.2M', color: 'text-emerald-600' },
  ];

         const allOrders = [
           {
             id: 'ORD001',
             customer: 'Nguyen Van A',
             carModel: 'VinFast VF 3',
             pickUpTime: '13:25 20/09/2025',
             returnTime: '13:25 21/09/2025',
             pickUpAddress: 'Vinhomes Oceanpark',
             rentalDate: '20/09/2025',
             status: 'Đã xác nhận',
             statusColor: 'bg-emerald-100 text-emerald-800'
           },
           {
             id: 'ORD002',
             customer: 'Tran Thi B',
             carModel: 'Toyota Camry',
             pickUpTime: '14:30 21/09/2025',
             returnTime: '14:30 22/09/2025',
             pickUpAddress: 'Vincom Center',
             rentalDate: '21/09/2025',
             status: 'Chờ xác nhận',
             statusColor: 'bg-yellow-100 text-yellow-800'
           },
         ];

  const carModels = ['VinFast VF 3', 'VinFast VF 5', 'VinFast VF 8', 'VinFast VF 9'];
  const statuses = ['Xác nhận', 'Đang xử lý', 'Hoàn thành', 'Hủy'];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-emerald-600 mb-6">Tổng quan hệ thống</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Combined Orders Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng</h2>
        
        {/* Filter Section */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Bộ lọc tìm kiếm</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Mã đơn hàng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCarModel}
              onChange={(e) => setSelectedCarModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Dòng xe</option>
              {carModels.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Trạng thái</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Chọn ngày nhận - ngày trả"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Combined Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-emerald-600 text-white">
            <div className="hidden lg:grid grid-cols-8 gap-4 p-4 font-semibold text-sm">
              <div>Mã đơn hàng</div>
              <div>Khách hàng</div>
              <div>Dòng xe</div>
              <div>Thời gian nhận xe</div>
              <div>Thời gian trả xe</div>
              <div>Địa chỉ nhận xe</div>
              <div>Trạng thái</div>
              <div>Thao tác</div>
            </div>
            <div className="lg:hidden p-4 font-semibold text-sm">
              Danh sách đơn hàng
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {allOrders.map((order, index) => (
              <React.Fragment key={index}>
                {/* Desktop View */}
                <div className="hidden lg:grid grid-cols-8 gap-4 p-4 hover:bg-gray-50">
                  <div 
                    className="font-medium text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate('/staff/order-details')}
                  >
                    {order.id}
                  </div>
                  <div className="text-gray-700">{order.customer}</div>
                  <div className="text-gray-700">{order.carModel}</div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {order.pickUpTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {order.returnTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {order.pickUpAddress}
                  </div>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => navigate('/staff/order-details')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
                
                {/* Mobile View */}
                <div className="lg:hidden p-4 border-b border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div 
                      className="font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => navigate('/staff/order-details')}
                    >
                      {order.id}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div><span className="font-semibold">Khách hàng:</span> {order.customer}</div>
                    <div><span className="font-semibold">Dòng xe:</span> {order.carModel}</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-semibold">Nhận:</span> {order.pickUpTime}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-semibold">Trả:</span> {order.returnTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="font-semibold">Địa chỉ:</span> {order.pickUpAddress}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => navigate('/staff/order-details')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
