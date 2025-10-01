import { Button } from "@/components/ui/button";
import type { Car } from "@/@types/car";

interface CarInfoProps {
  car: Car;
}

export default function CarInfo({ car }: CarInfoProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
        <div className="text-2xl font-bold text-green-600 mb-2">
          {car.pricePerDay.toLocaleString()} VND/Ngày
        </div>
        {car.discount}
      </div>

      <div className="grid grid-cols-2 gap-4 bg-" >
        <div className="space-y-2">
          <div className="text-sm text-gray-600">{car.seats} chỗ</div>
          <div className="text-sm text-gray-600">{car.horsepower} HP</div>
          <div className="text-sm text-gray-600">{car.trunkLiters} L</div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Range: {car.rangeKm} km</div>
          <div className="text-sm text-gray-600">{car.bodyType}</div>
          <div className="text-sm text-gray-600">
            Giới hạn di chuyển {car.dailyKmLimit} km/ngày
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
          size="lg"
        >
          Đặt xe
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          size="lg"
        >
          Nhận thông tin tư vấn
        </Button>
      </div>

      <div className="space-y-3">
        {car.amenities?.length ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Các tiện nghi khác
            </h3>
            <ul className="space-y-2">
              {car.amenities.map((a, i) => (
                <li key={i} className="text-sm text-gray-600">
                  • {a}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
