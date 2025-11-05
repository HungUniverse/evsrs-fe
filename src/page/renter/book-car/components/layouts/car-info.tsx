/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { modelAPI } from "@/apis/model-ev.api";
import { AmenityAPI } from "@/apis/amentities.api";
import { identifyDocumentAPI } from "@/apis/identify-document.api";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { vnd } from "@/lib/utils/currency";
import { AlertCircle } from "lucide-react";
type SearchState = {
  searchForm?: { location: string; start: string; end: string };
  province?: string;
};

export default function CarInfo() {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: SearchState };
  const { user } = useAuthStore();

  const [model, setModel] = useState<any | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [hasApprovedLicense, setHasApprovedLicense] = useState<boolean | null>(
    null
  );

  useEffect(() => {
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

  // Check user's driving license status
  useEffect(() => {
    const checkLicenseStatus = async () => {
      if (!user?.userId) {
        setHasApprovedLicense(false);
        return;
      }

      try {
        const response = await identifyDocumentAPI.getUserDocuments(
          user.userId
        );
        const isApproved = response.data?.status === "APPROVED";
        setHasApprovedLicense(isApproved);
      } catch {
        setHasApprovedLicense(false);
      }
    };

    checkLicenseStatus();
  }, [user?.userId]);

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

  const handleBookCar = () => {
    if (hasApprovedLicense === false) {
      setShowLicenseDialog(true);
      return;
    }

    navigate(`/pay-car/${model.id}`, {
      state: {
        model,
        searchForm: state?.searchForm,
        province: state?.province,
      },
    });
  };

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
            onClick={handleBookCar}
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

      {/* License Verification Dialog */}
      <Dialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <DialogTitle className="text-xl">Chưa xác thực GPLX</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-4">
              Bạn cần xác thực Giấy phép lái xe (GPLX) trước khi có thể đặt xe.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              📋 Yêu cầu để đặt xe:
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>CCCD hoặc Hộ chiếu còn thời hạn</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Bằng lái xe hợp lệ, còn thời hạn</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLicenseDialog(false)}
              className="flex-1"
            >
              Để sau
            </Button>
            <Button
              onClick={() => {
                setShowLicenseDialog(false);
                navigate("/account/my-profile");
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Xác thực ngay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
