import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/axios/axios";
import type { ItemBaseResponse } from "@/@types/response";
import type { OrderBookingDetail } from "@/@types/order/order-booking";
import type { Contract } from "@/@types/order/contract";
import { contractAPI } from "@/apis/contract.api";
import { PrintPdfButton } from "@/page/paper/dowloadpdfbutton";
import { PrintableContract } from "@/page/paper/printable-paper";
import ContractParties from "@/page/paper/contract/components/ContractParties";
import ContractCosts from "@/page/paper/contract/components/ContractCosts";

export default function AdminContractPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderBookingDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [contract, setContract] = useState<Contract | null>(null);
  const [checkingContract, setCheckingContract] = useState(false);

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
        // Handle error silently for admin
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
    } finally {
      setCheckingContract(false);
    }
  }

  useEffect(() => {
    refetchContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const title = useMemo(() => "HỢP ĐỒNG THUÊ XE Ô TÔ", []);

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

          {contract?.signatureUrl && (
            <div className="rounded-lg border p-4 bg-white">
              <div className="mb-3">
                <p className="font-medium">Chữ ký khách hàng</p>
              </div>
              <img
                src={contract.signatureUrl}
                className="h-28 border rounded bg-white"
                alt="Signature"
                crossOrigin="anonymous"
              />
            </div>
          )}

          {!contract && (
            <div className="text-center text-sm text-gray-600 italic py-4">
              Chưa có hợp đồng được tạo
            </div>
          )}
        </div>
      </PrintableContract>
    </div>
  );
}

