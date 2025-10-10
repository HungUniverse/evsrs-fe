import type { Model } from "@/@types/car/model";
import type { Depot } from "@/@types/car/depot";
import type { CarManufacture } from "@/@types/car/carManufacture";

export type CarCardVM = {
  id: string;
  modelName: string;
  image: string;
  pricePerDay: number;
  discount?: number;
  seats: number;
  province: string;
  dailyKmLimit?: number;
  manufacture?: string; // sẽ là TÊN hãng
  manufactureId?: string;
};

const num = (v: any, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

export function toCarCardVM(
  model: Model | undefined,
  depot: Depot | undefined,
  manuMap?: Map<string, CarManufacture>
): CarCardVM {
  const manuId = model?.manufacturerCarId as any;
  const manuName = manuMap?.get(manuId)?.name ?? undefined;

  return {
    id: (model as any)?.id,
    modelName: model?.modelName ?? "EV",
    image: (model as any)?.image ?? "/placeholder-car.jpg",
    pricePerDay: (model as any)?.price ?? 0,
    seats: model?.seats ?? 0,
    discount: (model as any)?.sale ?? undefined,
    province: depot?.province ?? "",
    dailyKmLimit: num((model as any)?.limiteDailyKm, undefined as any),
    manufacture: manuName,
    manufactureId: manuId,
  };
}
