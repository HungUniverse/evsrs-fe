import { useEffect, useState } from "react";
import { getTransactionsByUserId } from "@/apis/transaction.api";
import type { TransactionResponse } from "@/@types/payment/transaction";
import TransactionFilter from "./components/transaction-filter";
import TransactionList from "./components/transaction-list";
import type { TransactionFilterValue } from "./components/transaction-filter";
import { useAuthStore } from "@/lib/zustand/use-auth-store";

export default function AccountTransactions() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<TransactionFilterValue>({
    code: "",
    dateStart: undefined,
    dateEnd: undefined,
  });
  const [allTransactions, setAllTransactions] = useState<TransactionResponse[]>(
    []
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionResponse[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await getTransactionsByUserId(user.userId!);

        let data: TransactionResponse[] = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && typeof response === "object") {
          const responseData = (
            response as { data?: TransactionResponse | TransactionResponse[] }
          ).data;
          if (responseData) {
            data = Array.isArray(responseData) ? responseData : [responseData];
          }
        }

        setAllTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setAllTransactions([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.userId]);

  // Apply filters
  useEffect(() => {
    // Safety check: ensure allTransactions is an array
    if (!Array.isArray(allTransactions)) {
      setFilteredTransactions([]);
      return;
    }

    let filtered = [...allTransactions];

    // Filter by code
    if (filter.code) {
      filtered = filtered.filter((t) =>
        t.code.toLowerCase().includes(filter.code.toLowerCase())
      );
    }

    if (filter.dateStart) {
      const startDate = new Date(filter.dateStart);
      filtered = filtered.filter(
        (t) => new Date(t.transactionDate) >= startDate
      );
    }

    if (filter.dateEnd) {
      const endDate = new Date(filter.dateEnd);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => new Date(t.transactionDate) <= endDate);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );

    setFilteredTransactions(filtered);
  }, [filter, allTransactions]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-600 mt-2">
            Xem và quản lý các giao dịch của bạn
          </p>
        </div>

        <TransactionFilter value={filter} onChange={setFilter} />

        <TransactionList
          transactions={filteredTransactions}
          loading={loading}
        />
      </div>
    </div>
  );
}
