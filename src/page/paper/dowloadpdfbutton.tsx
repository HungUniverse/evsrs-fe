import React from "react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export function PrintPdfButton({
  targetRef,
  filename = "hop-dong-ecorent",
}: {
  targetRef: React.RefObject<HTMLElement>;
  filename?: string;
}) {
  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    documentTitle: filename,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 14mm;
      }
      body { 
        -webkit-print-color-adjust: exact; 
        print-color-adjust: exact; 
      }
      a { 
        text-decoration: none; 
        color: inherit; 
      }
      @media print {
        header, footer { display: none !important; }
      }
    `,
    onBeforePrint: async () => {
      toast.info(
        "💡 Để ẩn URL: Vào More settings → Tắt 'Headers and footers'",
        {
          duration: 5000,
        }
      );
    },
  });

  return (
    <Button variant="outline" onClick={handlePrint} className="gap-2">
      In / Lưu PDF
    </Button>
  );
}
