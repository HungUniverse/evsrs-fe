// ViewModel dùng cho Card
export type CarCardVM = {
  // key để render list; có thể là modelId hoặc "modelId|province"
  id: string;
  modelId: string;
  modelName: string;
  manufactureId?: string;
  image?: string;

  seats: number;
  pricePerDay: number;
  discount?: number;
  dailyKmLimit?: number;

  availableCount?: number;
};

export type CarEvItem = {
  id: string; // id của CarEV
  model: {
    id: string;
    modelName: string;
    batteryCapacityKwh?: string;
    rangeKm?: string;
    limiteDailyKm?: string;
    manufacturerCarId?: string;
    amenitiesId?: string;
    seats?: string;
    price?: number;
    sale?: number;
    image?: string;
  };
  depot?: {
    id: string;
    name: string;
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
    lattitude?: string;
    longitude?: string;
  };
  status: "AVAILABLE" | string;
  isDeleted?: boolean;
};

export function groupCarEvsToCards(
  carEvs: CarEvItem[],
  groupByProvince: boolean
): CarCardVM[] {
  const groups = new Map<
    string,
    { sample: CarEvItem; count: number; province?: string }
  >();

  for (const ev of carEvs) {
    const province = ev.depot?.province ?? "";
    const key = groupByProvince ? `${ev.model.id}|${province}` : ev.model.id;

    if (!groups.has(key)) {
      groups.set(key, {
        sample: ev,
        count: 1,
        province: groupByProvince ? province : undefined,
      });
    } else {
      const g = groups.get(key)!;
      g.count += 1;
    }
  }

  const results: CarCardVM[] = [];
  groups.forEach(({ sample, count, province }, key) => {
    const m = sample.model;
    results.push({
      id: key,
      modelId: m.id,
      modelName: m.modelName,
      manufactureId: m.manufacturerCarId,
      image: m.image,
      seats: Number(m.seats ?? 0) || 0,
      pricePerDay: Number(m.price ?? 0) || 0,
      discount: m.sale ? Number(m.sale) : undefined,
      dailyKmLimit: m.limiteDailyKm ? Number(m.limiteDailyKm) : undefined,
      availableCount: count,
    });
  });

  return results;
}
