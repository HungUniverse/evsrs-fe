import type { CarEV } from "@/@types/car/carEv";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
  const statusMap = {
    AVAILABLE: {
      label: "Sẵn sàng",
      className: "bg-green-100 text-green-700",
    },
    IN_USE: {
      label: "Đang sử dụng",
      className: "bg-orange-100 text-orange-700",
    },
    RESERVED: {
      label: "Đang tạm giữ",
      className: "bg-gray-100 text-orange-700",
    },
    REPAIRING: {
      label: "Đang sửa chữa",
      className: "bg-amber-100 text-amber-700",
    },
    UNAVAILABLE: {
      label: "Không khả dụng",
      className: "bg-red-100 text-red-700",
    },
  };
  return statusMap[status as keyof typeof statusMap] || statusMap.AVAILABLE;
};

function ViewCarDialog({
  viewDialogOpen,
  setViewDialogOpen,
  selectedCar,
}: {
  viewDialogOpen: boolean;
  setViewDialogOpen: (open: boolean) => void;
  selectedCar: CarEV | undefined;
}) {
  if (!selectedCar) return null;

  const statusInfo = getStatusBadge(selectedCar.status);

  return (
    <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết xe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Car Image */}
          {selectedCar.model?.image && (
            <div className="flex justify-center">
              <img
                src={selectedCar.model.image}
                alt={selectedCar.model.modelName}
                className="w-full max-h-60 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Biển số xe</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.licensePlate}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Mẫu xe</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.model?.modelName || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Sức khỏe pin</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.batteryHealthPercentage}%
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dung lượng pin</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.model?.batteryCapacityKwh || "N/A"} kWh
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Quãng đường tối đa</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.model?.rangeKm || "N/A"} km
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Số chỗ ngồi</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.model?.seats || "N/A"} chỗ
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Trạm</p>
              <p className="font-semibold text-gray-900">
                {selectedCar.depot?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewCarDialog;
