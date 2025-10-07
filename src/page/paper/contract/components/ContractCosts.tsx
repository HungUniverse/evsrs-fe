import type { Contract } from "@/@types/contract";

interface ContractCostsProps {
  contract: Contract;
}

function ContractCosts({ contract }: ContractCostsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          3. Chi phí thanh toán (Payment costs)
        </h3>
        <div className="space-y-1 pl-4">
          <div>
            <span className="font-medium text-gray-600">Giá thuê:</span>
            <span className="ml-2 text-gray-800">
              {contract.dailyRate.toLocaleString("vi-VN")} VNĐ/ngày
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Đặt cọc:</span>
            <span className="ml-2 text-gray-800">
              40% giá thuê của {contract.rentalDays} ngày:{" "}
              {contract.depositAmount.toLocaleString("vi-VN")}đ.
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">
              Số tiền còn lại cần trả sau:
            </span>
            <span className="ml-2 text-gray-800">
              {contract.remainingAmount.toLocaleString("vi-VN")}đ.
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Phí vượt km:</span>
            <span className="ml-2 text-gray-800">
              {contract.overMileageFee} vượt. Giới hạn: 300km/ngày (xe 4 chỗ),
              400km/ngày (xe 6 chỗ trở lên).
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Phí vượt giờ:</span>
            <span className="ml-2 text-gray-800">
              100.000 - 200.000 VNĐ/giờ.
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Các chi phí khác:</span>
            <span className="ml-2 text-gray-800">
              phí cầu đường, gửi xe, vi phạm giao thông do Bên B tự chi trả.
            </span>
          </div>
        </div>
      </div>

      {/* Phần 4: Chi phí dịch vụ và bảo hiểm */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          4. Chi phí dịch vụ và bảo hiểm (Service and insurance costs)
        </h3>
        <div className="space-y-1 pl-4">
          <div>
            <span className="font-medium text-gray-600">Bảo hiểm:</span>
            <span className="ml-2 text-gray-800">50.000 VNĐ/người</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Vệ sinh xe:</span>
            <span className="ml-2 text-gray-800">
              {contract.carWashFee} nếu xe bị bẩn quá mức thông thường.
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">
              Các sự cố đặc biệt:
            </span>
            <span className="ml-2 text-gray-800">
              mất giấy tờ hoặc chìa khóa bồi thường từ 1.000.000 - 3.000.000
              VNĐ; sau khi xe hết pin 500.000 - 1.000.000 VNĐ/lần; nếu xe hư
              hỏng do lỗi của khách thì phải bồi thường theo báo giá của hãng
              hoặc bên cho thuê.
            </span>
          </div>
        </div>
      </div>

      {/* Phần 5: Chi phí khi trả xe tại chi nhánh khác */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          5. Chi phí khi trả xe tại chi nhánh khác (One-way fee)
        </h3>
        <div className="space-y-1 pl-4">
          <div>
            <span className="text-gray-800">
              Trường hợp trả xe tại chi nhánh khác nơi nhận ban đầu sẽ phát sinh
              thêm phí.
            </span>
          </div>
          <div>
            <span className="text-gray-800">
              Có thể tính theo mức cố định từ 200.000 - 500.000 VNĐ/lần.
            </span>
          </div>
          <div>
            <span className="text-gray-800">
              Hoặc tính theo khoảng cách: 10.000 - 15.000 VNĐ/km giữa hai chi
              nhánh.
            </span>
          </div>
          <div>
            <span className="text-gray-800">
              Một số chương trình khuyến mãi hoặc dịch vụ car sharing nội thành
              có thể được miễn phí.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractCosts;
