export interface TransactionResponse {
  id: string;
  orderBookingId: string;
  userId: string;
  sepayId: string;
  gateway: string;
  transactionDate: string; // ISO datetime: "2025-10-29T12:08:00Z"
  accountNumber: string;
  code: string; // ví dụ: "ORD5432036"
  content: string; // nội dung chuyển khoản gốc
  transferType: "in" | "out"; // hướng giao dịch: in = nhận, out = gửi
  tranferAmount: string; // số tiền giao dịch (chuỗi để khớp API)
  accumulated: string; // tổng tích lũy hoặc số dư sau giao dịch
  subAccount: string | null; // tài khoản con (nếu có)
  referenceCode: string; // mã tham chiếu ngân hàng
  description: string; // mô tả mở rộng (ví dụ "BankAPINotify...")
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  createdBy: string;
  updatedBy: string | null;
  isDeleted: boolean;
}
