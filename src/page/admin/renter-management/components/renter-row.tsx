import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import { DocumentStatusCell } from "./document-status-cell";
import { VerificationStatusCell } from "./verification-status-cell";
import { getDocStatus } from "../utils/utils";

interface RenterTableRowProps {
  user: UserFull;
  isSelected: boolean;
  onSelectChange: (value: boolean) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  document: IdentifyDocumentResponse | null;
  hasDocumentLoaded: boolean;
  onStatusToggle: (user: UserFull, newStatus: "APPROVED" | "REJECTED") => void;
  onVerification: (user: UserFull) => void;
  onRequestDelete: (user: UserFull) => void;
}

export function RenterTableRow({
  user,
  isSelected,
  onSelectChange,
  onToggleExpand,
  document,
  hasDocumentLoaded,
  onStatusToggle,
  onVerification,
  onRequestDelete,
}: RenterTableRowProps) {
  const frontDoc = hasDocumentLoaded
    ? getDocStatus(Boolean(document?.frontImage), document?.status || "PENDING")
    : "loading";
  const backDoc = hasDocumentLoaded
    ? getDocStatus(Boolean(document?.backImage), document?.status || "PENDING")
    : "loading";

  return (
    <React.Fragment>
      <TableRow
        data-state={isSelected ? "selected" : undefined}
        className="cursor-pointer hover:bg-muted/50 transition-colors group"
        onClick={onToggleExpand}
      >
        <TableCell className="w-[40px]">
          <Checkbox
            aria-label={`Select ${user.fullName}`}
            checked={isSelected}
            onCheckedChange={(value) => onSelectChange(Boolean(value))}
            onClick={(event) => event.stopPropagation()}
          />
        </TableCell>
        <TableCell className="sticky left-0 bg-white group-hover:bg-muted/50 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
          <div className="flex items-center gap-3">
            <img
              src={
                user.profilePicture && user.profilePicture.trim() !== ""
                  ? user.profilePicture
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`
              }
              alt={user.fullName || "Người dùng"}
              className="size-10 rounded-full object-cover border border-muted shadow-sm"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName || "User")}`;
              }}
            />
            <div className="space-y-0.5">
              <div className="font-medium leading-tight">{user.fullName || "Chưa có tên"}</div>
              <div className="text-xs text-muted-foreground">{user.userName || "Chưa có tên đăng nhập"}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span>{user.phoneNumber || "Chưa có số điện thoại"}</span>
            <span className="text-xs text-muted-foreground">{user.userEmail || "Chưa có email"}</span>
          </div>
        </TableCell>
        <TableCell>
          <DocumentStatusCell frontDoc={frontDoc} backDoc={backDoc} />
        </TableCell>
        <TableCell>
          <VerificationStatusCell
            hasDocumentLoaded={hasDocumentLoaded}
            document={document}
            user={user}
            onStatusToggle={onStatusToggle}
            onVerification={onVerification}
          />
        </TableCell>
        <TableCell>{user.createdAt ? formatDate(user.createdAt) : "Chưa xác định"}</TableCell>
        <TableCell>{user.updatedAt ? formatDate(user.updatedAt) : "Chưa xác định"}</TableCell>
        <TableCell className="text-right sticky right-0 bg-white group-hover:bg-muted/50 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10 transition-colors">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleExpand();
                }}
              >
                Xem chi tiết
              </DropdownMenuItem>
              {document && (
                <DropdownMenuItem
                  onClick={(event) => {
                    event.stopPropagation();
                    onVerification(user);
                  }}
                >
                  Xác thực tài liệu
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={(event) => {
                  event.stopPropagation();
                  onRequestDelete(user);
                }}
              >
                <Trash2 className="size-4 mr-2" />
                Xóa người dùng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

