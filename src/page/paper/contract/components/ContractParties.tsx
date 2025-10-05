import type { Contract } from "@/@types/contract";

interface ContractPartiesProps {
  contract: Contract;
}

function ContractParties({ contract }: ContractPartiesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          1. Thông tin các bên (Information of the parties)
        </h3>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Bên cho thuê:</h4>
          <div className="space-y-1 pl-4">
            <div>
              <span className="font-medium text-gray-600">Tên công ty:</span>
              <span className="ml-2 text-gray-800">
                {contract.lessorCompanyName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Địa chỉ:</span>
              <span className="ml-2 text-gray-800">
                {contract.lessorAddress}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">SĐT:</span>
              <span className="ml-2 text-gray-800">{contract.lessorPhone}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Bên thuê:</h4>
          <div className="space-y-1 pl-4">
            <div>
              <span className="font-medium text-gray-600">Họ và tên:</span>
              <span className="ml-2 text-gray-800">
                {contract.lesseeFullName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">CCCD/CMND:</span>
              <span className="ml-2 text-gray-800">
                {contract.cccd}. Cấp ngày 27/06/2022 tại TP. Hồ Chí Minh.
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">GPLX:</span>
              <span className="ml-2 text-gray-800">
                {contract.gplx}. Hạng A. Cấp ngày 22/07/2023 tại TP. Hồ Chí
                Minh.
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Địa chỉ liên hệ:
              </span>
              <span className="ml-2 text-gray-800">
                {contract.lesseeAddress ||
                  "12 Nguyễn Trường Trung, Quận 1, TP. Hồ Chí Minh."}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">SĐT:</span>
              <span className="ml-2 text-gray-800">{contract.lesseePhone}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          2. Thông tin xe cho thuê (Information of the rented car)
        </h3>
        <div className="space-y-1 pl-4">
          <div>
            <span className="font-medium text-gray-600">Hãng và loại xe:</span>
            <span className="ml-2 text-gray-800">{contract.vehicleCode}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Biển số:</span>
            <span className="ml-2 text-gray-800">{contract.licensePlates}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Thời gian thuê:</span>
            <span className="ml-2 text-gray-800">
              từ 10 giờ ngày {new Date(contract.rentalStartDate).getDate()}, đến
              10 giờ ngày {new Date(contract.rentalEndDate).getDate()}.
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Địa chỉ nhận xe:</span>
            <span className="ml-2 text-gray-800">
              chi nhánh 2, {contract.pickupAddress}.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractParties;
