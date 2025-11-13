import * as React from "react";
import { Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { RenterTableRow } from "./renter-row";
import { ExpandedRowContent } from "./expanded-row-content";
import type { ImageModalState } from "../hooks/use-renter-table";

interface RenterTableContentProps {
  rows: UserFull[];
  selected: Record<string, boolean>;
  onToggleSelect: (userId: string, value: boolean) => void;
  expandedRow: string | null;
  onToggleExpand: (userId: string) => void;
  documents: Record<string, IdentifyDocumentResponse | null>;
  onStatusToggle: (user: UserFull, newStatus: "APPROVED" | "REJECTED") => void;
  onVerification: (user: UserFull) => void;
  onRequestDelete: (user: UserFull) => void;
  onImageClick: (state: ImageModalState) => void;
  startIndex?: number;
}

export function RenterTableContent({
  rows,
  selected,
  onToggleSelect,
  expandedRow,
  onToggleExpand,
  documents,
  onStatusToggle,
  onVerification,
  onRequestDelete,
  onImageClick,
  startIndex = 1,
}: RenterTableContentProps) {
  const hasData = rows.length > 0;

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#D1FAE5]">
          <TableRow>
            <TableHead className="w-[40px] text-[#065F46]" />
            <TableHead className="w-16 text-center text-[#065F46] sticky left-0 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              STT
            </TableHead>
            <TableHead className="text-[#065F46] sticky left-16 bg-[#D1FAE5] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">
              Người dùng
            </TableHead>
            <TableHead className="text-[#065F46]">Số điện thoại / Email</TableHead>
            <TableHead className="text-[#065F46]">Tài liệu</TableHead>
            <TableHead className="text-[#065F46]">Xác thực</TableHead>
            <TableHead className="text-[#065F46]">Ngày tạo</TableHead>
            <TableHead className="text-[#065F46]">Ngày cập nhật</TableHead>
            <TableHead className="w-[70px] text-right text-[#065F46] sticky right-0 bg-[#D1FAE5] shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)] z-10">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasData ? (
            rows.map((user, index) => {
              const document = documents[user.id];
              const hasDocumentLoaded = documents[user.id] !== undefined;

              return (
                <React.Fragment key={user.id}>
                  <RenterTableRow
                    user={user}
                    index={startIndex + index}
                    isSelected={Boolean(selected[user.id])}
                    onSelectChange={(value) => onToggleSelect(user.id, value)}
                    isExpanded={expandedRow === user.id}
                    onToggleExpand={() => onToggleExpand(user.id)}
                    document={document}
                    hasDocumentLoaded={hasDocumentLoaded}
                    onStatusToggle={onStatusToggle}
                    onVerification={onVerification}
                    onRequestDelete={onRequestDelete}
                  />
                  {expandedRow === user.id && (
                    <TableRow>
                      <TableCell colSpan={9} className="p-0">
                        <ExpandedRowContent
                          user={user}
                          document={document}
                          hasDocumentLoaded={hasDocumentLoaded}
                          onImageClick={onImageClick}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="py-12">
                <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                  <Users className="size-8" />
                  <div>
                    <p className="text-sm font-semibold">Chưa có người thuê nào</p>
                    <p className="text-xs">Không có dữ liệu người thuê để hiển thị.</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

