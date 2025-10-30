// Example: How to use System Config Store
import { useSystemConfigStore } from "@/lib/zustand/use-system-config-store";

export default function ExampleComponent() {
  // Get deposit amount from global store
  const { depositAmount, loading, error } = useSystemConfigStore();

  if (loading) {
    return <div>Loading deposit amount...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Deposit Amount</h2>
      <p>Tiền cọc: {depositAmount ? `${depositAmount} VNĐ` : "N/A"}</p>

      {/* Example: Display in any format */}
      <div>
        Số tiền cọc:{" "}
        {depositAmount ? Number(depositAmount).toLocaleString("vi-VN") : "0"} đ
      </div>
    </div>
  );
}

// You can use depositAmount anywhere in your app like this:
// const { depositAmount } = useSystemConfigStore();
