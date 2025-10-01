import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Car } from "@/@types/car";

interface CarGalleryProps {
  car: Car;
}

// Tạo array hình ảnh từ car data (có thể mở rộng sau)
const getCarImages = (car: Car) => [
  car.image,
  car.image, // Có thể thêm nhiều góc chụp khác nhau
  car.image,
  car.image,
];

export default function CarGallery({ car }: CarGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const carImages = getCarImages(car);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Main Image */}
      <div className="relative mb-4">
        <img
          src={carImages[currentImage]}
          alt={car.name}
          className="w-full h-96 object-cover rounded-lg"
        />
        
        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {carImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
              currentImage === index ? "border-green-500" : "border-gray-200"
            }`}
          >
            <img
              src={image}
              alt={`${car.name} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
