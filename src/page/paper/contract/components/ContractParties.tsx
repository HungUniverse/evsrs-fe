import { useEffect, useState } from "react";
import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { identifyDocumentAPI } from "@/apis/identify-document.api";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";

const COMPANY_NAME =
  import.meta.env.VITE_COMPANY_NAME ?? "Công ty TNHH ECORENT VIỆT NAM";
const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE ?? "0900000001";
const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL ?? "info@ecorent.com";

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("vi-VN");
}

export default function ContractParties({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [doc, setDoc] = useState<IdentifyDocumentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        // 1) Order
        const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        if (ignore) return;
        const ob = res.data.data;
        setOrder(ob);

        // 2) Identify document (CCCD/GPLX)
        if (ob?.userId) {
          try {
            const idRes = await identifyDocumentAPI.getUserDocuments(ob.userId);
            if (!ignore) setDoc(idRes.data);
          } catch {
            // không có giấy tờ -> để trống
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-5 md:p-6">
        <div className="h-4 w-48 bg-slate-100 rounded mb-3" />
        <div className="space-y-2">
          <div className="h-3 w-80 bg-slate-100 rounded" />
          <div className="h-3 w-72 bg-slate-100 rounded" />
          <div className="h-3 w-60 bg-slate-100 rounded" />
        </div>
      </section>
    );
  }

  const depotName = order?.depot?.name || "Kho xe";

  const lesseeName = order?.user?.userName || "Khách hàng";

  const lesseePhone = order?.user?.phone || "";

  const cccd = doc?.numberMasked || "";
  const gplxClass = doc?.licenseClass ? `Hạng ${doc.licenseClass}` : "";
  const gplxExpire = fmtDate(doc?.expireAt);

  return (
    <section className=" p-5 md:p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        1. Thông tin các bên
      </h3>

      {/* Bên cho thuê */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Bên cho thuê:</h4>
        <div className="space-y-1 pl-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Tên công ty:</span>
            <span className="ml-2 text-gray-800">{COMPANY_NAME}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Địa điểm:</span>
            <span className="ml-2 text-gray-800">{depotName}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">SĐT:</span>
            <span className="ml-2 text-gray-800">{COMPANY_PHONE}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span>
            <span className="ml-2 text-gray-800">{COMPANY_EMAIL}</span>
          </div>
        </div>
      </div>

      {/* Bên thuê */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Bên thuê:</h4>
        <div className="space-y-1 pl-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Họ và tên:</span>
            <span className="ml-2 text-gray-800">{lesseeName}</span>
          </div>

          <div>
            <span className="font-medium text-gray-600">CCCD/CMND:</span>
            <span className="ml-2 text-gray-800">{cccd || "—"}</span>
          </div>

          <div>
            <span className="font-medium text-gray-600">GPLX:</span>
            <span className="ml-2 text-gray-800">
              {gplxClass || "—"}
              {gplxExpire ? `, Hết hạn: ${gplxExpire}` : ""}
            </span>
          </div>

          {lesseePhone && (
            <div>
              <span className="font-medium text-gray-600">SĐT:</span>
              <span className="ml-2 text-gray-800">{lesseePhone}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
