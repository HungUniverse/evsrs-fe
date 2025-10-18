// src/pages/contract/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ContractParties from "./components/ContractParties";
import ContractCosts from "./components/ContractCosts";
import { toast } from "sonner";

import { api } from "@/lib/axios/axios";
import { handoverContractAPI } from "@/apis/handover-contract.api"; // API tạo contract (bạn đã có)
import { contractAPI } from "@/apis/contract.api"; // API fetch contract theo orderId
import { uploadDataUrlToCloudinary } from "@/lib/utils/cloudinary";

import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { Contract } from "@/@types/order/contract";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import SignatureDialog from "./components/sign-box";

function genContractNumber() {
  const d = new Date();
  return `HD-${d.getFullYear()}${(d.getMonth() + 1 + "").padStart(2, "0")}${(
    d.getDate() + ""
  ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const ContractPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // NEW: state về contract hiện tại
  const [contract, setContract] = useState<Contract | null>(null);
  const [checkingContract, setCheckingContract] = useState(false);

  // Sign UI
  const [openSign, setOpenSign] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [savingSignature, setSavingSignature] = useState(false);

  const [creating, setCreating] = useState(false);

  // Load order
  useEffect(() => {
    (async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const res = await api.get<ItemBaseResponse<OrderBookingDetail>>(
          `/api/OrderBooking/${orderId}`
        );
        setOrder(res.data.data);
      } catch {
        toast.error("Lỗi tải dữ liệu đơn hàng");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  // NEW: Load contract theo orderId
  async function refetchContract() {
    if (!orderId) return;
    setCheckingContract(true);
    try {
      const c = await contractAPI.getByOrderId(orderId);
      setContract(c);
      // nếu đã có contract (kể cả F5), show luôn chữ ký
      if (c?.signatureUrl) setSignatureUrl(c.signatureUrl);
    } finally {
      setCheckingContract(false);
    }
  }

  useEffect(() => {
    refetchContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const title = useMemo(() => "HỢP ĐỒNG THUÊ XE Ô TÔ", []);
  const isSigned = contract?.signStatus === "SIGNED";

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

  // Tạo contract -> xong thì refetch + ẩn khu ký
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
      await handoverContractAPI.create({
        userId: user.userId,
        orderBookingId: orderId,
        contractNumber: genContractNumber(),
        startDate: order.startAt,
        endDate: order.endAt,
        fileUrl: "", // MVP: chưa tạo PDF
        signatureUrl,
        signStatus: "SIGNED",
      });

      toast.success("Đã tạo hợp đồng");
      await refetchContract(); // ⬅️ chuyển UI sang trạng thái có hợp đồng
    } catch {
      toast.error("Tạo hợp đồng thất bại");
    } finally {
      setCreating(false);
    }
  }

  if (loading || checkingContract) {
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Không thể tải hợp đồng
          </h3>
          <p className="text-gray-600">Hợp đồng không tồn tại</p>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border bg-white">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
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
              Số hợp đồng: {contract?.contractNumber ?? "—"}
            </div>
          </div>
        </div>
        <div>
          <ContractParties orderId={orderId!} />

          <ContractCosts orderId={orderId!} />
        </div>

        <div className="rounded-lg border p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="font-medium">Chữ ký khách hàng</p>

            {!isSigned && (
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
            )}
          </div>

          {(signatureUrl || contract?.signatureUrl) && (
            <img
              src={signatureUrl ?? contract?.signatureUrl ?? ""}
              className="h-28 border rounded bg-white"
              alt="Signature preview"
            />
          )}
        </div>

        {!isSigned && (
          <div className="flex justify-end">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Đang lưu..." : "Xác nhận & Tạo hợp đồng"}
            </Button>
          </div>
        )}

        <SignatureDialog
          open={openSign}
          onOpenChange={setOpenSign}
          onSave={handleSignatureSaved}
        />
      </div>
    </section>
  );
};

export default ContractPage;
