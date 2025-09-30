export default function RentalCondition() {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Điều kiện thuê xe</h2>

      {/* Required Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Thông tin cần có khi nhận xe
        </h3>
        <div className="space-y-2 pl-4">
          <div className="text-sm text-gray-600">
            • CCCD hoặc Hộ chiếu còn thời hạn
          </div>
          <div className="text-sm text-gray-600">
            • Bằng lái hợp lệ, còn thời hạn
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Hình thức thanh toán
        </h3>
        <div className="space-y-2 pl-4">
          <div className="text-sm text-gray-600">• Trả trước</div>
          <div className="text-sm text-gray-600">
            • Thời hạn thanh toán: đặt cọc giữ xe thanh toán 100% khi kí hợp
            đồng và nhận xe
          </div>
        </div>
      </div>

      {/* Deposit Policy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Chính sách đặt cọc (thế chân)
        </h3>
        <div className="space-y-2 pl-4">
          <div className="text-sm text-gray-600">
            • Khách hàng phải thanh toán tiền cọc
          </div>
        </div>
      </div>
    </div>
  );
}
