import React from 'react';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const orderData = {
    orderCode: 'XXXXXXXXXXXXX',
    status: 'Xác nhận',
    renterInfo: {
      fullName: 'Nguyễn Vân A',
      phone: '0987654321',
      email: 'nguyenvana@gmail.com'
    },
    orderInfo: {
      rentalType: 'Thuê theo ngày',
      carModel: 'VinFast VF 3',
      pickUpAddress: 'Vinhomes Oceanpark, nhà để xe Hải Âu',
      pickUpTime: '13:25 20/09/2025',
      returnTime: '13:25 21/09/2025'
    },
    billing: [
      { type: 'Cước phí niêm yết', unitPrice: '590.000₫', quantity: 1, total: '590.000₫' },
      { type: 'Phụ phí cuối tuần', unitPrice: '100.000₫', quantity: 1, total: '100.000₫' },
      { type: 'Tiền đặt cọc', unitPrice: '', quantity: '', total: '5.000.000₫' }
    ],
    grandTotal: '5.690.000₫',
    documents: [
      'Hợp đồng thuê xe',
      'Biên bản giao xe',
      'Biên bản trả xe'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="text-blue-600 hover:text-blue-800"
          onClick={() => navigate('/staff/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Chi tiết đơn hàng
        </Button>
      </div>

      {/* Order Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Mã đơn hàng: {orderData.orderCode}</p>
          </div>
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            {orderData.status}
          </span>
        </div>
      </div>

      {/* Renter Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">THÔNG TIN NGƯỜI THUÊ</h2>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Họ và tên: </span>
            <span>{orderData.renterInfo.fullName}</span>
          </div>
          <div>
            <span className="font-semibold">Số điện thoại: </span>
            <span>{orderData.renterInfo.phone}</span>
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            <span>{orderData.renterInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">THÔNG TIN ĐƠN HÀNG</h2>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Hình thức thuê: </span>
            <span>{orderData.orderInfo.rentalType}</span>
          </div>
          <div>
            <span className="font-semibold">Dòng xe: </span>
            <span>{orderData.orderInfo.carModel}</span>
          </div>
          <div>
            <span className="font-semibold">Địa chỉ nhận xe: </span>
            <span>{orderData.orderInfo.pickUpAddress}</span>
          </div>
          <div>
            <span className="font-semibold">Thời gian nhận xe: </span>
            <span>{orderData.orderInfo.pickUpTime}</span>
          </div>
          <div>
            <span className="font-semibold">Thời gian trả xe: </span>
            <span>{orderData.orderInfo.returnTime}</span>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">BẢNG KÊ CHI TIẾT</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-emerald-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Loại</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Đơn giá</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Số lượng</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {orderData.billing.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">{item.unitPrice}</td>
                  <td className="py-3 px-4">{item.quantity}</td>
                  <td className="py-3 px-4 font-semibold">{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="py-3 px-4 font-bold text-right">Tổng</td>
                <td className="py-3 px-4 font-bold text-lg">{orderData.grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Attached Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">TÀI LIỆU ĐÍNH KÈM</h2>
        <div className="space-y-2">
          {orderData.documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-blue-600 hover:underline">{doc}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
