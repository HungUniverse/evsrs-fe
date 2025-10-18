import HeaderLite from "@/components/headerLite";
import Footer from "../components/layout/footer";
import RentalCondition from "./components/layouts/rental-condition";
import CarInfo from "./components/layouts/car-info";

export default function BookCar() {
  return (
    <div>
      <HeaderLite />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CarInfo />
          <div className="mt-12">
            <RentalCondition />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
