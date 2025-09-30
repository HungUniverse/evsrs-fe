// @/@types/car.ts
export type Car = {
  id: string;
  name: string;
  image: string;
  model: string;
  pricePerDay: number;
  seats: 4 | 5 | 7;
  rating: number;
  trips: number;
  freeDeposit: boolean;
  discount: number;
  province: "TP. Hồ Chí Minh" | "Hà Nội" | "Đà Nẵng" | "Cần Thơ";
  rangeKm: number;

  horsepower: number; // HP
  trunkLiters: number; // dung tích cốp (L)
  bodyType: "Mini" | "Hatchback" | "Sedan" | "CUV" | "SUV" | "MPV" | "Pickup";
  dailyKmLimit: number; // giới hạn km/ngày
  amenities?: string[]; // tiện nghi khác
};
