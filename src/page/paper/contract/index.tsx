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

        if (
          response.message === SepayOrderStatus.PAID_DEPOSIT_COMPLETED ||
          response.message === SepayOrderStatus.PAID_FULL
        ) {
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

  // Check if rental date has arrived (only compare date, not time)
  const isRentalDateValid = useMemo(() => {
    if (!order?.startAt) return false;
    const now = new Date();
    const startDate = new Date(order.startAt);

    // Set both dates to start of day (00:00:00) for date-only comparison
    const nowDateOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startDateOnly = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    return nowDateOnly >= startDateOnly;
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
        userId: order.userId,
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
    <div className="space-y-4">
      {/* Warning banner if rental date hasn't arrived yet */}
      {!isRentalDateValid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-yellow-900">
                Chưa đến ngày thuê xe
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Hiện tại chưa đến ngày thuê, bạn chỉ có thể xem hợp đồng. Vui
                lòng quay lại vào ngày{" "}
                <strong>
                  {new Date(order.startAt).toLocaleDateString("vi-VN")}
                </strong>{" "}
                để ký hợp đồng và nhận xe.
              </p>
            </div>
          </div>
        </div>
      )}

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

              {!isSigned && isRentalDateValid && (
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

          {isSigned && orderId && !isPaid && order && (
            <PaymentQR orderId={orderId} paymentType={order.paymentType} />
          )}

          {isSigned && isPaid && ""}

          {!isSigned && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleCreate}
                disabled={creating || !isRentalDateValid}
              >
                {creating ? "Đang lưu..." : "Xác nhận & Tạo hợp đồng"}
              </Button>
            </div>
          )}

          {!isRentalDateValid && (
            <div className="text-center text-sm text-gray-600 italic py-4">
              Hiện tại chưa đến ngày thuê, bạn chỉ có thể xem hợp đồng
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
