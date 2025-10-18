/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { handoverInspectionAPI } from "@/apis/hand-over-inspection.api";
import { returnInspectionAPI } from "@/apis/return-inspection.api";

type Inspection = { images?: string | null; createdAt?: string };

function splitUrls(s?: string | null) {
  if (!s) return [];
  return String(s)
    .split(/[,\n;]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function Section({
  title,
  urlsCsv,
  emptyText = "Không có ảnh",
}: {
  title: string;
  urlsCsv?: string | null;
  emptyText?: string;
}) {
  const list = useMemo(() => splitUrls(urlsCsv), [urlsCsv]);

  return (
    <section className="space-y-2">
      <p className="text-sm text-slate-500">
        {title} {list.length ? `(${list.length})` : ""}
      </p>

      {list.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list.map((u, i) => (
            <Dialog key={u + i}>
              <DialogTrigger asChild>
                <img
                  src={u}
                  alt={`${title}-${i}`}
                  className="w-full h-28 object-cover rounded border cursor-pointer"
                  loading="lazy"
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <img
                  src={u}
                  alt={`preview-${i}`}
                  className="w-full h-auto rounded"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500">{emptyText}</div>
      )}
    </section>
  );
}

/** Tự fetch ảnh Handover + Return theo orderId từ URL */
export default function InspectionImagesByOrder({
  showHandover = true,
  showReturn = true,
  sideBySide = true, // 🎯 mới: bật layout 2 cột song song
  className = "",
}: {
  showHandover?: boolean;
  showReturn?: boolean;
  sideBySide?: boolean;
  className?: string;
}) {
  const { orderId } = useParams<{ orderId: string }>();
  const [handover, setHandover] = useState<Inspection | null>(null);
  const [ret, setRet] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const h = await handoverInspectionAPI.getByOrderId(orderId);
        if (Array.isArray(h)) {
          h.sort(
            (a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt)
          );
          setHandover(h[0] ?? null);
        } else {
          setHandover(h ?? null);
        }

        try {
          const r = await returnInspectionAPI.getByOrderId(orderId);
          if (Array.isArray(r)) {
            r.sort(
              (a: any, b: any) =>
                +new Date(b.createdAt) - +new Date(a.createdAt)
            );
            setRet(r[0] ?? null);
          } else {
            setRet(r ?? null);
          }
        } catch {
          setRet(null);
        }
      } catch (e: any) {
        toast.error(e?.message || "Không tải được ảnh biên bản");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (!orderId) return null;

  const twoCols = sideBySide && showHandover && showReturn;

  return (
    <div className={`rounded-lg border p-4 space-y-4 ${className}`}>
      <div className="font-semibold">Ảnh biên bản</div>

      {loading ? (
        <div className="flex items-center justify-center h-28">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : twoCols ? (
        // 🧱 Song song 2 cột trên màn hình md+ (mobile vẫn xếp dọc)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Ảnh lúc giao (Handover)" urlsCsv={handover?.images} />
          <Section title="Ảnh lúc trả (Return)" urlsCsv={ret?.images} />
        </div>
      ) : (
        // Mặc định dọc như cũ
        <>
          {showHandover && (
            <Section
              title="Ảnh lúc giao (Handover)"
              urlsCsv={handover?.images}
            />
          )}
          {showReturn && (
            <Section title="Ảnh lúc trả (Return)" urlsCsv={ret?.images} />
          )}
        </>
      )}
    </div>
  );
}
