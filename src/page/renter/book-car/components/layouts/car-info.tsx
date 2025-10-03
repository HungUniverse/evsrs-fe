import { Button } from "@/components/ui/button";
import type { Car } from "@/@types/car";
import { useLocation, useNavigate } from "react-router";

export default function CarInfo() {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { car: Car; location: string; start: string; end: string };
  };
  const car = location.state?.car;
  const province = location.state?.location ?? "TP. Hồ Chí Minh";
  const start = location.state?.start;
  const end = location.state?.end;
  if (!car) return <div>Không tìm thấy xe</div>;
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="mb-2">
        {car.discount ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through">
              {car.pricePerDay.toLocaleString()}đ
            </span>

            <span className="text-green-600 font-bold text-xl">
              {(car.pricePerDay * (1 - car.discount / 100)).toLocaleString()}
              đ/ngày
            </span>
            <span className="text-red-500 font-semibold">-{car.discount}%</span>
          </div>
        ) : (
          <div className="text-2xl font-bold text-green-600">
            {car.pricePerDay.toLocaleString()} VND/Ngày
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 bg-">
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
          onClick={() =>
            navigate(`/pay-car/${car.id}`, {
              state: { car, province, start, end },
            })
          }
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
