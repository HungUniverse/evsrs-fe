import React, { forwardRef } from "react";

/** Bọc nội dung hợp đồng để in ra PDF vector (chữ nét) */
export const PrintableContract = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(function PrintableContract({ children }, ref) {
  return (
    <div
      ref={ref}
      className="bg-white text-gray-900 max-w-[800px] mx-auto p-8 md:p-10 rounded-xl shadow-sm print:shadow-none print:rounded-none"
    >
      <style>{`
          .break-before { break-before: page; }
          .avoid-break { break-inside: avoid; }
          @media print {
            html, body { font-size: 13px; }
            /* Ẩn URL và tiêu đề trang khi in */
            @page { margin: 14mm; }
            header, footer { display: none; }
          }
        `}</style>
      {children}
    </div>
  );
});
