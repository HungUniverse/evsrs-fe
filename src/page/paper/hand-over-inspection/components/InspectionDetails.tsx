import React from 'react';
import type { Contract } from '@/@types/contract';

interface InspectionDetailsProps {
  contract: Contract;
}

const InspectionDetails: React.FC<InspectionDetailsProps> = ({ contract }) => {
  return (
    <div className="space-y-8">
      {/* Phần 4: Thời gian thuê */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          4. THỜI GIAN THUÊ
        </h3>
        <div className="space-y-2 pl-4">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Thời điểm bắt đầu thuê (Dự kiến giao xe): ...... giờ ...... ngày ...... tháng ...... năm ......
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Thời điểm bên thuê thực tế nhận xe tại: ...... (Chi nhánh ......)
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Thời điểm kết thúc thuê (Dự kiến trả xe): ...... giờ ...... ngày ...... tháng ...... năm ......
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Thời điểm bên thuê thực tế trả xe tại: ...... (Chi nhánh ......)
            </span>
          </div>
        </div>
      </div>

      {/* Phần 5: Kiểm tra tình trạng xe */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          5. KIỂM TRA TÌNH TRẠNG XE (GIAO/NHẬN CÓP TƯƠNG ỨNG)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left font-semibold bg-gray-50">Hạng mục</th>
                <th className="border border-gray-300 p-2 text-left font-semibold bg-gray-50">Khi giao</th>
                <th className="border border-gray-300 p-2 text-left font-semibold bg-gray-50">Khi trả</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Số km/ODO</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Nhiên liệu (lít)</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Ngoại thất (trầy xước, cọp, móp,...)</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Nội thất (ghế, taplo, trần, thảm,...)</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Lốp/Vành/Phanh</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Máy/Đèn/Còi/Loa/Điều hòa</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Bộ kích/Cờ lê/Con đội/Túi cứu thương</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Giấy tờ xe (đăng kiểm, bảo hiểm,...)</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Bản photo (...)</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Gps, camera hành trình, camera lùi</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Gạt mưa, cần số, vô lăng</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Ảnh hiện trạng (PMM bên ngoài/nội thất)</td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="border-b border-gray-300 h-6"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Phần 6: Xác nhận giao nhận */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          6. XÁC NHẬN GIAO NHẬN
        </h3>
        <div className="space-y-2 pl-4">
          <div className="flex items-start">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Hai bên đã kiểm tra, đối chiếu thực tế và xác nhận tình trạng xe & tài sản kèm theo đúng như mô tả ở trên và không có bất kỳ khiếu nại nào.
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 mr-2">•</span>
            <span className="text-gray-800">
              Bên thuê đồng ý thuê xe và cam kết thực hiện đúng thỏa thuận tại HĐ số ...... ký ngày ...... tháng ...... năm ......
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
