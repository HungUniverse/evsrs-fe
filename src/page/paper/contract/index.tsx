// src/pages/contract/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ContractParties from "./components/ContractParties";
import ContractCosts from "./components/ContractCosts";
import { toast } from "sonner";

import { api } from "@/lib/axios/axios";
import { handoverContractAPI } from "@/apis/handover-contract.api";
import { uploadDataUrlToCloudinary } from "@/lib/utils/cloudinary";

import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import SignatureDialog from "./components/sign-box";

function genContractNumber() {
  const d = new Date();
  return `HD-${d.getFullYear()}${(d.getMonth() + 1 + "").padStart(2, "0")}${(
    d.getDate() + ""
  ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const Contract: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [openSign, setOpenSign] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [savingSignature, setSavingSignature] = useState(false);

  const [creating, setCreating] = useState(false);
  const [createdNumber, setCreatedNumber] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        setOrder(res.data.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        toast.error("Lỗi tải dữ liệu đơn hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const title = useMemo(() => "HỢP ĐỒNG THUÊ XE Ô TÔ", []);

  async function handleSignatureSaved(dataUrl: string) {
    try {
      setSavingSignature(true);
      const url = await uploadDataUrlToCloudinary(dataUrl);
      setSignatureUrl(url);
      toast.success("Đã lưu chữ ký");
    } catch {
      toast.error("Upload chữ ký thất bại");
    } finally {
      setSavingSignature(false);
    }
  }

  async function handleCreate() {
    if (!user?.userId) return toast.error("Thiếu thông tin người dùng");
    if (!orderId) return toast.error("Thiếu orderBookingId");
    if (!order) return toast.error("Thiếu dữ liệu đơn hàng");
    if (!signatureUrl) {
      setOpenSign(true);
      return toast.error("Vui lòng ký trước khi xác nhận");
    }

    setCreating(true);
    try {
      const created = await handoverContractAPI.create({
        userId: user.userId,
        orderBookingId: orderId,
        contractNumber: genContractNumber(),
        startDate: order.startAt,
        endDate: order.endAt,
        fileUrl: "", // MVP: chưa tạo PDF
        signatureUrl, // URL chữ ký đã upload
        signStatus: "SIGNED", // hoặc "SIGNED" nếu bạn muốn
      });

      setCreatedNumber(created.contractNumber);
      toast.success("Đã tạo hợp đồng");
      navigate(`/account/my-trip/${orderId}`);
    } catch {
      toast.error("Tạo hợp đồng thất bại");
    } finally {
      setCreating(false);
    }
  }

  const handleBack = (): void => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu hợp đồng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Không thể tải hợp đồng
          </h3>
          <p className="text-gray-600 mb-4">Hợp đồng không tồn tại</p>
          <Button onClick={handleBack} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border bg-white ">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold uppercase">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h1>
            <h2 className="text-xl font-bold uppercase">
              Độc lập – Tự do – Hạnh phúc
            </h2>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-lg">---------------------------------</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold uppercase text-gray-800">
              {title}
            </h3>
            <div className="text-lg font-medium">
              Số hợp đồng: {createdNumber ?? "—"}
            </div>
          </div>
        </div>

        {/* Component 1: Thông tin các bên và xe (tự fetch theo orderId) */}
        <ContractParties orderId={orderId!} />

        {/* Component 2: Chi phí và điều khoản (tự fetch theo orderId) */}
        <ContractCosts orderId={orderId!} />

        {/* Chữ ký + CTA */}
        <div className="rounded-lg border p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">Chữ ký khách hàng</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpenSign(true)}>
                Mở bảng ký
              </Button>
              {savingSignature && (
                <span className="text-xs text-slate-500">đang lưu...</span>
              )}
              {signatureUrl && (
                <span className="text-xs text-emerald-700">
                  ✅ Đã lưu chữ ký
                </span>
              )}
            </div>
          </div>
          {signatureUrl && (
            <img
              src={signatureUrl}
              className="h-28 border rounded bg-white"
              alt="Signature preview"
            />
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Đang lưu..." : "Xác nhận & Tạo hợp đồng"}
          </Button>
        </div>

        {/* Dialog ký (tách component) */}
        <SignatureDialog
          open={openSign}
          onOpenChange={setOpenSign}
          onSave={handleSignatureSaved}
        />
      </div>
    </section>
  );
};

export default Contract;
