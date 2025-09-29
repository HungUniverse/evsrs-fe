export type Car = {
  id: string;
  name: string;
  image: string;
  model: string;
  pricePerDay: number; // giá gốc 1 ngày (chưa giảm)
  seats: 4 | 5 | 7;
  rating?: number;
  trips?: number;
  batteryKwh?: number;
  rangeKm?: number;
  province?: string;
  freeDeposit?: boolean; // true = miễn thế chấp
  discount?: number;
  // % giảm giá, ví dụ 15 = giảm 15%
};
