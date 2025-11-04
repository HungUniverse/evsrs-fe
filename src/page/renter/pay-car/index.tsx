import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import BookingForm from "./components/booking-form";
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
  const [searchForm, setSearchForm] = useState(state?.searchForm);

  const handleTimeChange = (start: string, end: string) => {
    setSearchForm((prev) => {
      if (!prev) return prev;
      return { ...prev, start, end };
    });
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id to prevent infinite loop

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

  return (
    <div className="min-h-screen bg-gray-100">
      <BookingForm
        car={model}
        searchForm={searchForm ?? { location: "", start: "", end: "" }}
        onTimeChange={handleTimeChange}
      />
      <Footer />
    </div>
  );
}
