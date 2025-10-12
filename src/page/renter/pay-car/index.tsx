import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BookingForm from "./components/booking-form";
import HeaderLite from "@/components/headerLite";
import Footer from "../components/layout/footer";
import { modelAPI } from "@/apis/model-ev.api";
import type { Model } from "@/@types/car/model";

export default function PayCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      model?: Model;
      searchForm?: { location: string; start: string; end: string };
    };
  };

  const [model, setModel] = useState<Model | null>(state?.model ?? null);
  const searchForm = state?.searchForm;

  useEffect(() => {
    if (model || !id) return;
    (async () => {
      try {
        const m = await modelAPI.getById(id);
        setModel(m);
      } catch {
        setModel(null);
      }
    })();
  }, [id, model]);

  if (!model) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy xe
          </h1>
          <button
            onClick={() => navigate("/search-car")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  if (!searchForm?.location || !searchForm.start || !searchForm.end) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thiếu thông tin đặt xe
          </h1>
          <p className="text-gray-600 mb-4">
            Vui lòng chọn thời gian và địa điểm trước khi đặt xe.
          </p>
          <button
            onClick={() => navigate("/search-car")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderLite />
      <BookingForm car={model} searchForm={searchForm} />
      <Footer />
    </div>
  );
}
