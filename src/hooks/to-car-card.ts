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
  province?: string;
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
  options?: { groupByProvince?: boolean; currentProvince?: string | null }
): CarCardVM[] {
  const groupByProvince = options?.groupByProvince ?? false;
  const currentProvince = options?.currentProvince?.trim() || undefined;

  const groups = new Map<
    string,
    { m: CarEvItem["model"]; count: number; province?: string }
  >();

  for (const ev of carEvs) {
    const modelId = ev.model.id;
    const evProvince = (ev.depot?.province ?? "").trim();

    const key = groupByProvince ? `${modelId}|${evProvince}` : modelId;

    const displayProvince =
      currentProvince || (groupByProvince ? evProvince : undefined);

    if (!groups.has(key)) {
      groups.set(key, { m: ev.model, count: 1, province: displayProvince });
    } else {
      const g = groups.get(key)!;
      g.count += 1;
      if (!g.province && displayProvince) g.province = displayProvince;
    }
  }

  return Array.from(groups, ([id, g]) => {
    const m = g.m;
    return {
      id,
      modelId: m.id,
      modelName: m.modelName,
      manufactureId: m.manufacturerCarId,
      image: m.image,
      seats: Number(m.seats ?? 0) || 0,
      pricePerDay: Number(m.price ?? 0) || 0,
      discount: m.sale ? Number(m.sale) : undefined,
      dailyKmLimit: m.limiteDailyKm ? Number(m.limiteDailyKm) : undefined,
      province: g.province,
      availableCount: g.count,
    };
  });
}
