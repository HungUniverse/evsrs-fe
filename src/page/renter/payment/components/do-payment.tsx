import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { vnd } from "@/lib/utils/currency";
import qr from "@/images/qr.png";
import bank from "@/images/bank.png";

type PaymentState = {
  amount: number;
  car: {
    id: string;
    name: string;
  };
  depot: string;
  paymentMethod: string;
  notes?: string;
  searchForm: {
    location: string;
    start: string;
    end: string;
  };
};

function randomTxn() {
  return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
}

export default function DoPayment() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: PaymentState };
  const txnId = useMemo(() => randomTxn(), []);

  useEffect(() => {
    if (!state?.amount) {
      navigate("/", { replace: true });
      return;
    }

    console.log("Thông tin đơn hàng:", {
      ...state,
      txnId,
    });
  }, [state, txnId, navigate]);

  if (!state?.amount) return null;
  //de keo zo db sau
  const { amount, car, depot, paymentMethod, notes, searchForm } = state;

  return (
    <section className="max-w-5xl mx-auto p-6">
      <div className="rounded-2xl border bg-white shadow-sm">
        <header className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Thanh toán</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div className="rounded-xl border p-4 space-y-3">
              <h2 className="font-semibold text-lg">Thông tin đơn hàng</h2>
              <hr className="border-t" />
              <div className="space-y-3 text-md">
                <div>
                  <div className="text-gray-600">Số tiền thanh toán</div>
                  <div className="text-blue-600">{vnd(amount)} VND</div>
                </div>
                <div>
                  <div className="text-gray-600">Phí giao dịch</div>
                  <div className="text-blue-600">0 VND</div>
                </div>
                <div>
                  <div className="text-gray-600">Mã giao dịch</div>
                  <div className="font-mono">{txnId}</div>
                </div>
                <div>
                  <div className="text-gray-600 font-semibold">
                    Nhà cung cấp
                  </div>
                  <div className="text-gray-900 font-semibold">
                    CÔNG TY TNHH ECRENT VIỆT NAM
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-4 flex flex-col items-center">
            <h3 className="font-semibold mb-4 text-center">
              Quét mã qua ứng dụng Ngân hàng / Ví điện tử
            </h3>
            <img
              src={qr}
              alt="QR thanh toán"
              className="w-75 h-75 object-contain bg-white p-2 rounded"
            />
            <button
              onClick={() => navigate("/search-car")}
              className="mt-4 px-4 py-2 rounded border"
            >
              Hủy thanh toán
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <img
            src={bank}
            alt="Danh sách ngân hàng"
            className="w-full max-w-3xl"
          />
        </div>
      </div>
    </section>
  );
}
