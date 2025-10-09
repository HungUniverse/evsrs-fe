import { useParams } from "react-router-dom";
import { mockContracts } from "@/mockdata/mock-contract";
import type { Contract } from "@/@types/contract";
import DetailInformation from "./components/detail-information";
import DetailPaper from "./components/detail-paper";
import DetailPrice from "./components/detail-price";

export default function TripDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const contract = (mockContracts as Contract[]).find(
    (c) => c.orderId === orderId
  );

  if (!contract) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-slate-600">Order ID: {orderId}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Khung chính giống mock */}
      <section className="rounded-2xl border bg-white p-5 md:p-6">
        <div className="text-lg font-semibold mb-4">Chi tiết đơn hàng</div>

        <div className="rounded-xl bg-sky-100 px-4 py-3">
          <span className="text-sm">Mã đơn hàng:&nbsp;</span>
          <span className="font-medium tracking-wide">{contract.orderId}</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          <DetailInformation contract={contract} />
          <DetailPaper orderId={contract.orderId} />
        </div>
      </section>

      <DetailPrice contract={contract} />
    </div>
  );
}
