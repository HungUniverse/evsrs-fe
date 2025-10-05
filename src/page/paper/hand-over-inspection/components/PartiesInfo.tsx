import React from "react";
import type { Contract } from "@/@types/contract";

interface PartiesInfoProps {
  contract: Contract;
}

const PartiesInfo: React.FC<PartiesInfoProps> = ({ contract }) => {
  return (
    <div className="space-y-8">
      {/* Phần 1: Bên A - Bên cho thuê */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          1. BÊN A - BÊN CHO THUÊ (BÊN GIAO XE/BÊN NHẬN XE KHI TRẢ)
        </h3>
        <div className="space-y-3">
          <div className="flex items-center ">
            <span className="font-medium text-gray-600 w-100">
              Tên công ty:
              <span className="ml-2 text-gray-800">
                {contract.lessorCompanyName}
              </span>
            </span>
          </div>
          <div className="flex items-center ">
            <span className="font-medium text-gray-600 w-100">
              Địa chỉ:
              <span className="ml-2 text-gray-800">
                {contract.lessorAddress}
              </span>
            </span>
          </div>
          <div className="flex items-center ">
            <span className="font-medium text-gray-600 w-100">
              Điện thoại:
              <span className="ml-2 text-gray-800">{contract.lessorPhone}</span>
            </span>
          </div>
          <div className="flex items-center ">
            <span className="font-medium text-gray-600 ml-0">
              Email:
              <span className="ml-2 text-gray-800">{contract.lessorEmail}</span>
            </span>
          </div>
          <div className="flex items-center ">
            <span className="font-medium text-gray-600 w-40">
              Người đại diện: ....
            </span>
          </div>
        </div>
      </div>

      {/* Phần 2: Bên B - Bên thuê */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          2. BÊN B - BÊN THUÊ (BÊN NHẬN XE/BÊN TRẢ KHI TRẢ)
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Họ và tên:</span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Địa chỉ:</span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Điện thoại:</span>
            <div className="w-32 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">Email:</span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              Người đại diện:
            </span>
            <div className="w-32 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">Chức vụ:</span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              CCCD/CMND số:
            </span>
            <div className="w-32 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">Ngày cấp:</span>
            <div className="w-24 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">Nơi cấp:</span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              Giấy phép lái xe số:
            </span>
            <div className="w-32 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">Hạng:</span>
            <div className="w-16 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">Ngày cấp:</span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
        </div>
      </div>

      {/* Phần 3: Thông tin xe */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          3. THÔNG TIN XE
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              Nhãn hiệu/Dòng xe:
            </span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">
              Biển kiểm soát:
            </span>
            <div className="w-32 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">
              Số khung VIN:
            </span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-40">Số máy:</span>
            <div className="w-32 border-b border-gray-300 ml-2"></div>
            <span className="font-medium text-gray-600 ml-4">
              Năm sản xuất:
            </span>
            <div className="flex-1 border-b border-gray-300 ml-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartiesInfo;
