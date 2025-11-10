import { ShieldCheck, AlertTriangle, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentStatusCellProps {
  frontDoc: "loading" | "ok" | "review" | "missing";
  backDoc: "loading" | "ok" | "review" | "missing";
}

export function DocumentStatusCell({ frontDoc, backDoc }: DocumentStatusCellProps) {
  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              {frontDoc === "loading" ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : frontDoc === "ok" ? (
                <ShieldCheck className="text-emerald-500" />
              ) : frontDoc === "review" ? (
                <AlertTriangle className="text-amber-500" />
              ) : (
                <Minus className="text-muted-foreground" />
              )}
              <span className="text-xs">Mặt trước</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            Mặt trước:{" "}
            {frontDoc === "loading"
              ? "Đang tải..."
              : frontDoc === "ok"
                ? "Đã xác thực"
                : frontDoc === "review"
                  ? "Cần review"
                  : "Thiếu"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              {backDoc === "loading" ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : backDoc === "ok" ? (
                <ShieldCheck className="text-emerald-500" />
              ) : backDoc === "review" ? (
                <AlertTriangle className="text-amber-500" />
              ) : (
                <Minus className="text-muted-foreground" />
              )}
              <span className="text-xs">Mặt sau</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            Mặt sau:{" "}
            {backDoc === "loading"
              ? "Đang tải..."
              : backDoc === "ok"
                ? "Đã xác thực"
                : backDoc === "review"
                  ? "Cần review"
                  : "Thiếu"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

