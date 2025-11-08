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
}: RenterTableContentProps) {
  const hasData = rows.length > 0;

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead>Người dùng</TableHead>
            <TableHead>Số điện thoại / Email</TableHead>
            <TableHead>Tài liệu</TableHead>
            <TableHead>Xác thực</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Ngày cập nhật</TableHead>
            <TableHead className="w-[70px] text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasData ? (
            rows.map((user) => {
              const document = documents[user.id];
              const hasDocumentLoaded = documents[user.id] !== undefined;

              return (
                <React.Fragment key={user.id}>
                  <RenterTableRow
                    user={user}
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
                      <TableCell colSpan={8} className="p-0">
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
              <TableCell colSpan={8} className="py-12">
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

