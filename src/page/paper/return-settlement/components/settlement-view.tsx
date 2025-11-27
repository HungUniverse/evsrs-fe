import type { ReturnSettlement } from "@/@types/order/return-settlement";
import { toNum } from "@/hooks/use-booking-car-cal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Row({ l, r }: { l: string; r?: string | number | null }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-slate-600">{l}</span>
      <span className="font-medium">{r ?? "—"}</span>
    </div>
  );
}

function splitUrls(csv?: string | null): string[] {
  if (!csv) return [];
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function SettlementView({ data }: { data: ReturnSettlement }) {
  return (
    <section className="rounded-lg border p-4 space-y-6">
      <div className="font-semibold text-lg">
        Biên bản thanh toán khi trả xe
      </div>

      <div className="rounded-md border p-4">
        <div className="font-medium text-base mb-3">Các khoản phát sinh</div>
        {data.settlementItems?.length ? (
          <div className="space-y-4">
            {data.settlementItems.map((it) => {
              const images = splitUrls(it.image);
              return (
                <div key={it.id} className="rounded border p-3 bg-slate-50/50">
                  <div className="space-y-3">
                    <div className="font-semibold text-base">
                      {it.description || "—"}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs">
                          Phí phát sinh
                        </span>
                        <span className="font-medium">
                          {toNum(it.feeIncurred).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs">Giảm</span>
                        <span className="font-medium">
                          {toNum(it.discount).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs">Tổng</span>
                        <span className="font-semibold text-blue-600">
                          {toNum(it.total).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                    {it.notes && (
                      <div className="text-xs text-slate-600 p-2 bg-slate-100 rounded">
                        <span className="font-medium">Ghi chú:</span> {it.notes}
                      </div>
                    )}

                    {images.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="text-xs text-slate-500 mb-2">
                          Ảnh minh chứng ({images.length})
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                          {images.map((url: string, idx: number) => (
                            <Dialog key={url + idx}>
                              <DialogTrigger asChild>
                                <div className="cursor-pointer">
                                  <img
                                    src={url}
                                    className="w-full aspect-square object-cover rounded border hover:opacity-80 transition-opacity"
                                  />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <div className="space-y-2">
                                  <div className="font-semibold">
                                    {it.description} - Ảnh {idx + 1}
                                  </div>
                                  <img
                                    src={url}
                                    className="w-full h-auto max-h-[75vh] object-contain rounded"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-slate-500 py-4 text-center">
            Không có khoản phát sinh
          </div>
        )}
      </div>

      <div className="rounded-md border p-4 bg-blue-50/50">
        <div className="font-medium text-base mb-3">Tổng kết</div>
        <div className="space-y-2">
          <Row
            l="Thời điểm tính"
            r={new Date(data.calculateAt).toLocaleString("vi-VN")}
          />
          <Row
            l="Subtotal"
            r={`${toNum(data.subtotal).toLocaleString("vi-VN")} đ`}
          />
          <Row
            l="Giảm tổng"
            r={`${toNum(data.discount).toLocaleString("vi-VN")} đ`}
          />
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-base font-semibold">
              <span>Tổng thanh toán</span>
              <span className="text-blue-600 text-lg">
                {toNum(data.total).toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
          {data.notes && (
            <div className="pt-2 border-t mt-2">
              <div className="text-sm">
                <span className="text-slate-600">Ghi chú:</span>{" "}
                <span className="font-medium">{data.notes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
