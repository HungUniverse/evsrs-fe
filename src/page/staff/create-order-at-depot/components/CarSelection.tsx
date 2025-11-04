import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { CarEV } from "@/@types/car/carEv";
import { vnd } from "@/lib/utils/currency";

interface CarSelectionProps {
  cars: CarEV[];
  selectedCarId: string;
  onChange: (carId: string) => void;
  error?: string;
}

export function CarSelection({
  cars,
  selectedCarId,
  onChange,
  error,
}: CarSelectionProps) {
  const selectedCar = cars.find((car) => car.id === selectedCarId);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="car-select" className="text-base font-semibold">
          Chọn xe <span className="text-red-500">*</span>
        </Label>
        <Select value={selectedCarId} onValueChange={onChange}>
          <SelectTrigger
            id="car-select"
            className={`mt-2 ${error ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Chọn xe..." />
          </SelectTrigger>
          <SelectContent>
            {cars.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Không có xe nào khả dụng
              </div>
            ) : (
              cars.map((car) => (
                <SelectItem key={car.id} value={car.id}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {car.model?.modelName ?? "-"}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-700">{car.licensePlate}</span>
                    <span className="text-gray-700">
                      {vnd(car.model.price)}đ
                    </span>
                    <Badge
                      variant={
                        car.status === "AVAILABLE" ? "default" : "secondary"
                      }
                      className="ml-2"
                    >
                      {car.status === "AVAILABLE" ? "Sẵn sàng" : car.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {selectedCar && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h3 className="font-semibold text-gray-900">Chi tiết xe đã chọn</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Model:</span>
              <span className="ml-2 font-medium">
                {selectedCar.model.modelName}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Biển số:</span>
              <span className="ml-2 font-medium">
                {selectedCar.licensePlate}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Giá:</span>
              <span className="ml-2 font-medium">
                {vnd(selectedCar.model.price)}đ
              </span>
            </div>
            <div>
              <span className="text-gray-500">Số km giới hạn 1 ngày:</span>
              <span className="ml-2 font-medium">
                {selectedCar.model.limiteDailyKm}km
              </span>
            </div>

            <div>
              <span className="text-gray-500">Trạng thái:</span>
              <Badge
                variant={
                  selectedCar.status === "AVAILABLE" ? "default" : "secondary"
                }
                className="ml-2"
              >
                {selectedCar.status === "AVAILABLE"
                  ? "Sẵn sàng"
                  : selectedCar.status}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
