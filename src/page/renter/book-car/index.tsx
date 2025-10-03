import { useLocation, useParams } from "react-router-dom";
import CarGallery from "./components/layouts/car-gallery";
import CarInfo from "./components/layouts/car-info";
import RentalCondition from "./components/layouts/rental-condition";
import type { Car } from "@/@types/car";
import { mockCars } from "@/mockdata/mock-car";
import Footer from "../components/layout/footer";
import HeaderLite from "@/components/headerLite";

export default function BookCar() {
  const location = useLocation();
  const { id } = useParams();

  console.log("BookCar - ID:", id);
  console.log("BookCar - Location state:", location.state);
 
  const car =
    (location.state as { car: Car })?.car ||
    mockCars.find((c) => c.id === id) ||
    mockCars[0];

  console.log("BookCar - Selected car:", car);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy xe
          </h1>
          <p className="text-gray-600">Xe bạn tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderLite />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="flex justify-center lg:justify-start">
            <CarGallery car={car} />
          </div>

          <div className="flex justify-center lg:justify-start">
            <CarInfo />
          </div>
        </div>

        <div className="mb-12">
          <RentalCondition />
        </div>
      </div>
      <Footer />
    </div>
  );
}
