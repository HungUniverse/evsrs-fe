import { useLocation, useParams, useNavigate } from "react-router-dom";
import BookingForm from "./components/booking-form";
import type { Car } from "@/@types/car";
import { mockCars } from "@/mockdata/mock-car";
import HeaderLite from "@/components/headerLite";
import Footer from "../components/layout/footer";


export default function PayCar() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: {
      car: Car;

      searchForm?: {
        location: string;
        start: string;
        end: string;
      };
    };
  };

  const car = location.state?.car;

  const searchForm = location.state?.searchForm;

  // If no car data from state, try to find by carId
  const selectedCar = car || mockCars.find((c) => c.id === carId);

  if (!selectedCar) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy xe
          </h1>
          <p className="text-gray-600 mb-4">Xe bạn tìm kiếm không tồn tại.</p>
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
        <BookingForm
          car={selectedCar}
          searchForm={searchForm}
        />
      <Footer />
    </div>
  );
}
