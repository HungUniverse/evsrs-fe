// src/pages/account/components/show-my-trip.tsx
import { useEffect, useMemo, useState } from "react";
import type { OrderBookingStatus } from "@/@types/enum";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { fmtDateTime } from "@/hooks/fmt-date-time";
import {
  TRIP_STATUS_LABEL,
  TRIP_STATUS_PILL,
} from "@/lib/constants/trip-status";
import { modelAPI } from "@/apis/model-ev.api"; // 👈 cần có getById(id)

type Props = {
  data: OrderBookingDetail[];
  onClickCode?: (orderId: string) => void;
};

export default function ShowMyTrip({ data, onClickCode }: Props) {
  // 1) Lấy danh sách modelId duy nhất từ data
  const modelIds = useMemo(() => {
    const ids = new Set<string>();
    for (const ob of data) {
      const mid = getModelId(ob);
      if (mid) ids.add(mid);
    }
    return Array.from(ids);
  }, [data]);

  // 2) Fetch tên model theo id và cache vào map
  const { names: modelNameMap, loading: modelLoading } =
    useModelNames(modelIds);

  return (
    <section className="rounded-xl overflow-hidden border">
      <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1.4fr_0.9fr] bg-emerald-100 text-emerald-900 text-sm font-medium">
        {[
          "Đơn hàng",
          "Dòng xe",
          "Thời gian nhận xe",
          "Thời gian trả xe",
          "Địa chỉ nhận xe",
          "Trạng thái",
        ].map((h) => (
          <div key={h} className="px-4 py-3">
            {h}
          </div>
        ))}
      </div>

      <div className="divide-y">
        {data.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500">
            Không có chuyến nào phù hợp.
          </div>
        )}

        {data.map((ob) => {
          const orderId = ob.id;
          const modelId = getModelId(ob);
          const modelName =
            (modelId && modelNameMap[modelId]) ||
            (modelLoading ? "Đang tải…" : "-");

          const start = ob.startAt;
          const end = ob.endAt;
          const depotName = ob.depot?.name ?? "-";
          const status = ob.status as OrderBookingStatus | undefined;

          return (
            <div
              key={orderId}
              className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1.4fr_0.9fr] text-sm"
            >
              <div className="px-4 py-3">
                <button
                  className="text-sky-600 hover:underline"
                  onClick={() => onClickCode?.(orderId)}
                  title={orderId}
                >
                  {shortId(orderId, 8)}
                </button>
              </div>

              <div className="px-4 py-3 text-slate-700">{modelName}</div>

              <div className="px-4 py-3 text-slate-700">
                {start ? fmtDateTime(start) : "-"}
              </div>

              <div className="px-4 py-3 text-slate-700">
                {end ? fmtDateTime(end) : "-"}
              </div>

              <div
                className="px-4 py-3 text-slate-700 truncate"
                title={depotName}
              >
                {depotName}
              </div>

              <div className="px-4 py-3">
                {status ? (
                  <StatusPill status={status} />
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: OrderBookingStatus }) {
  const pillClass =
    TRIP_STATUS_PILL[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
  const label = TRIP_STATUS_LABEL[status] ?? status.replaceAll("_", " ");

  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium ${pillClass}`}
      title={status}
    >
      {label}
    </span>
  );
}

/** ================= Helpers ================= */
function shortId(id: string, keep = 8) {
  if (!id) return "-";
  return id.length > keep ? id.slice(0, keep) + "…" : id;
}

// Ưu tiên trường mới (modelId) – vẫn hỗ trợ schema cũ (model.id) để an toàn
function getModelId(ob: OrderBookingDetail): string | undefined {
  return ob?.carEvs?.modelId ?? ob?.carEvs?.model?.id ?? undefined;
}

/** Hook fetch & cache model names theo id */
function useModelNames(modelIds: string[]) {
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ids = Array.from(new Set(modelIds.filter(Boolean)));
    if (ids.length === 0) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const model = await modelAPI.getById(id);
              const name = model?.modelName ?? "";
              return [id, name] as const;
            } catch {
              return [id, ""] as const;
            }
          })
        );

        if (!cancelled) {
          const map: Record<string, string> = {};
          for (const [id, name] of results) {
            if (name) map[id] = name;
          }
          setNames((prev) => ({ ...prev, ...map }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [modelIds]);

  return { names, loading };
}
