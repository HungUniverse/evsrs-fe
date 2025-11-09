import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { getStatusLabel } from "../utils/utils";

interface VerificationStatusCellProps {
  hasDocumentLoaded: boolean;
  document: IdentifyDocumentResponse | null;
  user: UserFull;
  onStatusToggle: (user: UserFull, newStatus: "APPROVED" | "REJECTED") => void;
  onVerification: (user: UserFull) => void;
}

export function VerificationStatusCell({
  hasDocumentLoaded,
  document,
  user,
  onStatusToggle,
  onVerification,
}: VerificationStatusCellProps) {
  if (!hasDocumentLoaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!document) {
    return <Badge variant="outline" className="whitespace-nowrap">Không có tài liệu</Badge>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-3">
        <Badge
          variant={
            document.status === "APPROVED"
              ? "default"
              : document.status === "REJECTED"
                ? "destructive"
                : "outline"
          }
          className="whitespace-nowrap"
        >
          {getStatusLabel(document.status)}
        </Badge>

        {document.status !== "PENDING" && (
          <div className="flex items-center gap-2">
            <button
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                document.status === "APPROVED" ? "bg-blue-600" : "bg-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                const newStatus = document.status === "APPROVED" ? "REJECTED" : "APPROVED";
                onStatusToggle(user, newStatus);
              }}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  document.status === "APPROVED" ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs text-muted-foreground">
              {document.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối"}
            </span>
          </div>
        )}

        {document.status === "PENDING" && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onVerification(user);
            }}
          >
            Xác thực
          </Button>
        )}
      </div>
    </div>
  );
}

