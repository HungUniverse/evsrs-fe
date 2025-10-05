import React from "react";
import type { Contract } from "@/@types/contract";

interface PaymentContractProps {
  contract: Contract;
}

const PaymentContract: React.FC<PaymentContractProps> = ({ contract }) => {
  return (
    <div className="space-y-8">
      {/* Phần 7: Công nợ & Thanh toán */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          7. CÔNG NỢ & THANH TOÁN
        </h3>

        {/* 1. Đối chiếu công nợ */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">
            1. Đối chiếu công nợ:
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-left font-semibold bg-gray-50">
                    Hạng mục
                  </th>
                  <th className="border border-gray-300 p-2 text-left font-semibold bg-gray-50">
                    Số liệu/Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">
                    Số km giao/km trong gói
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">km</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Thực tế</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">km</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Vượt</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">km</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Đơn giá</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">VNĐ/km</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Phí vượt km</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">VNĐ</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Phí vệ sinh xe</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">VNĐ</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">
                    Phí phát sinh khác (nếu có)
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">(ghi rõ)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">
                    Tiền bồi thường (nếu có)
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">(ghi rõ)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Khác</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex items-center">
                      <div className="border-b border-gray-300 h-6 flex-1"></div>
                      <span className="ml-2 text-gray-600">VNĐ</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Tổng kết thanh toán */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">
            2. Tổng kết thanh toán:
          </h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Tổng tiền phí bổ sung:
              </span>
              <div className="flex-1 border-b border-gray-300 ml-2"></div>
              <span className="ml-2 text-gray-600">VNĐ</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Tiền cọc thu:
              </span>
              <div className="flex-1 border-b border-gray-300 ml-2"></div>
              <span className="ml-2 text-gray-600">VNĐ</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Số tiền cần (Bên phải thanh toán thêm)/được hoàn trả:
              </span>
              <div className="flex-1 border-b border-gray-300 ml-2"></div>
              <span className="ml-2 text-gray-600">VNĐ</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Phương thức thanh toán:
              </span>
              <span className="ml-2 text-gray-800">
                Tiền mặt/Chuyển khoản/Online (Mã GD: ......)
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Bên nhận tiền:
              </span>
              <div className="flex items-center ml-2 space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-800">Bên A</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-800">Bên B</span>
                </label>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Bên trả tiền:
              </span>
              <div className="flex items-center ml-2 space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-800">Bên A</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-800">Bên B</span>
                </label>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-48">
                Email nhận HĐ:
              </span>
              <div className="flex-1 border-b border-gray-300 ml-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần 8: Cam kết và thanh lý hợp đồng */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          8. CAM KẾT VÀ THANH LÝ HỢP ĐỒNG
        </h3>
        <div className="space-y-2 pl-4">
          <div className="flex items-start">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Bản biên bản này là một phần không thể tách rời của Hợp đồng thuê
              xe số: ......
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Bên A xác nhận đã nhận lại xe & tài sản kèm theo theo mục V, VI và
              VII và không có khiếu nại gì.
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Bên B xác nhận đã bàn giao xe đúng thời hạn thuê và chấp nhận mọi
              nghĩa vụ phát sinh nếu có và không có bất kỳ khiếu nại nào.
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Biên bản này được lập thành 02 bản có giá trị pháp lý như nhau,
              mỗi bên giữ 01 bản.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentContract;
