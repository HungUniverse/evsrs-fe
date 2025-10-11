import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { modelAPI } from "@/apis/model-ev.api";
import { AmenityAPI } from "@/apis/amentities.api";
import { vnd } from "@/lib/utils/currency";
type SearchState = {
  searchForm?: { location: string; start: string; end: string };
  province?: string;
};

export default function CarInfo() {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: SearchState };

  const [model, setModel] = useState<any | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("id =", id);
    if (!id) {
      setError("Không có id");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const m = await modelAPI.getById(id);
        setModel(m);
        console.log("Loaded model:", m);
        if (m?.amenitiesId) {
          try {
            const res = await AmenityAPI.getById(m.amenitiesId);
            setAmenities(res.name ? [res.name] : []);
          } catch {
            // không chặn màn nếu tiện nghi lỗi
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message ?? e?.message ?? "Lỗi tải model");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const priceInfo = useMemo(() => {
    const price = Number(model?.price ?? 0);
    const sale = Math.max(0, Number(model?.sale ?? 0));
    const finalPrice = sale > 0 ? Math.round(price * (1 - sale / 100)) : price;
    return { price, sale, finalPrice };
  }, [model]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
        <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="text-center text-red-500 py-10">
        {error ?? "Không tìm thấy xe"}
      </div>
    );
  }

  const seats = Number(model.seats ?? 0) || undefined;
  const rangeKm = model.rangeKm ?? undefined;
  const dailyKmLimit = model.limiteDailyKm ?? undefined;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div>
        <img
          src={model.image}
          alt={model.modelName}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="mb-2">
          {priceInfo.sale > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through">
                {vnd(priceInfo.price)}đ
              </span>
              <span className="text-green-600 font-bold text-xl">
                {vnd(priceInfo.finalPrice)}đ/ngày
              </span>
              <span className="text-red-500 font-semibold">
                -{priceInfo.sale}%
              </span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-green-600">
              {vnd(priceInfo.price)}đ/ngày
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {seats !== undefined && (
            <div className="text-sm text-gray-600">{seats} chỗ</div>
          )}
          {rangeKm && (
            <div className="text-sm text-gray-600">Range: {rangeKm} km</div>
          )}
          {dailyKmLimit && (
            <div className="text-sm text-gray-600 col-span-2 lg:col-span-1">
              Giới hạn di chuyển {dailyKmLimit} km/ngày
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={() =>
              navigate(`/pay-car/${model.id}`, {
                state: {
                  model, // truyền model để hiển thị ở PayCar
                  searchForm: state?.searchForm,
                  province: state?.province, // giữ tỉnh đã chọn
                },
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

        {amenities.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Các tiện nghi khác
            </h3>
            <ul className="space-y-1">
              {amenities.map((n, i) => (
                <li key={i} className="text-sm text-gray-600">
                  • {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
