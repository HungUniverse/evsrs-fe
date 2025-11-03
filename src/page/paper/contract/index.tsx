// src/pages/contract/index.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { PrintPdfButton } from "../dowloadpdfbutton";
import { PrintableContract } from "../printable-paper";
import PaymentQR from "./components/PaymentQR";
import { checkSepayOrderStatus } from "@/apis/sepay.api";
import { SepayOrderStatus } from "@/@types/payment/sepay";

function genContractNumber() {
  const d = new Date();
  return `HD-${d.getFullYear()}${(d.getMonth() + 1 + "").padStart(2, "0")}${(
    d.getDate() + ""
  ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const ContractPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
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
  const [isPaid, setIsPaid] = useState(false);

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

  async function refetchContract() {
    if (!orderId) return;
    setCheckingContract(true);
    try {
      const c = await contractAPI.getByOrderId(orderId);
      setContract(c);
      if (c?.signatureUrl) setSignatureUrl(c.signatureUrl);
    } finally {
      setCheckingContract(false);
    }
  }

  useEffect(() => {
    refetchContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!orderId) return;

      try {
        const response = await checkSepayOrderStatus(orderId);

        if (response.message === SepayOrderStatus.PAID_DEPOSIT_COMPLETED) {
          setIsPaid(true);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkPaymentStatus();
  }, [orderId]);

  const title = useMemo(() => "HỢP ĐỒNG THUÊ XE Ô TÔ", []);
  const isSigned = contract?.signStatus === "SIGNED";

  // Check if rental date has arrived
  const isRentalDateValid = useMemo(() => {
    if (!order?.startAt) return false;
    const now = new Date();
    const startDate = new Date(order.startAt);
    return now >= startDate;
  }, [order?.startAt]);

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

  // Check if rental date has not arrived yet
  if (!isRentalDateValid) {
    const startDate = new Date(order.startAt);
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-white-50 border-2 border-blue-400 rounded-2xl p-8 text-center shadow-lg">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chưa đến thời gian thuê xe
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn chỉ có thể ký hợp đồng và nhận xe khi đến ngày thuê
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6 border border-yellow-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Ngày bắt đầu thuê
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {startDate.toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Thời gian còn lại
                  </p>
                  <p className="text-lg font-semibold text-orange-600">
                    {Math.ceil(
                      (startDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    ngày
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start text-left bg-blue-50 rounded-lg p-4">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-blue-900">
                  Vui lòng quay lại vào{" "}
                  <strong>{startDate.toLocaleDateString("vi-VN")}</strong> để ký
                  hợp đồng và nhận xe
                </p>
              </div>

              <Button
                onClick={() => window.history.back()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-lg"
              >
                Quay lại trang trước
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  /////
  return (
    <div className="space-y-4">
      <PrintPdfButton
        targetRef={printRef as React.RefObject<HTMLElement>}
        filename="hop-dong-ecorent"
      />
      <PrintableContract ref={printRef}>
        <div className="space-y-8">
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
                crossOrigin="anonymous"
              />
            )}
          </div>

          {isSigned && orderId && !isPaid && <PaymentQR orderId={orderId} />}

          {isSigned && isPaid && ""}

          {!isSigned && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleCreate}
                disabled={creating}
              >
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
      </PrintableContract>
    </div>
  );
};

export default ContractPage;
