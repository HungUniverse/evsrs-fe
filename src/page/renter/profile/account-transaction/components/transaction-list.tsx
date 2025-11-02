import type { TransactionResponse } from "@/@types/payment/transaction";
import { Card } from "@/components/ui/card";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CreditCard,
} from "lucide-react";

type Props = {
  transactions: TransactionResponse[];
  loading: boolean;
};

function formatCurrency(amount: string) {
  const num = parseFloat(amount);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionList({ transactions, loading }: Props) {
  // Safety check: ensure transactions is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giao dịch...</p>
        </div>
      </div>
    );
  }

  if (safeTransactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có giao dịch
            </h3>
            <p className="text-gray-600">
              Bạn chưa có giao dịch nào trong hệ thống
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {safeTransactions.map((transaction) => {
        const isIncoming = transaction.transferType === "in";

        return (
          <Card key={transaction.id} className="p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              {/* Left: Icon & Info */}
              <div className="flex gap-4">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    isIncoming
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isIncoming ? (
                    <ArrowDownLeft className="h-6 w-6" />
                  ) : (
                    <ArrowUpRight className="h-6 w-6" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {transaction.code}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(transaction.transactionDate)}
                    </span>
                    <span>Ref: {transaction.referenceCode}</span>
                    {transaction.gateway && (
                      <span className="font-medium">{transaction.gateway}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Amount */}
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    isIncoming ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isIncoming} -{formatCurrency(transaction.tranferAmount)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Số dư: {formatCurrency(transaction.accumulated)}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
