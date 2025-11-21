import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  Edit,
  Eye,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  User,
  UserPlus,
  XCircle,
} from "lucide-react";
import type { UserFull } from "@/@types/auth.type";
import type { IdentifyDocumentResponse } from "@/@types/identify-document";
import { formatDate } from "@/lib/utils/formatDate";
import { getImageUrl } from "../utils/utils";
import type { ImageModalState } from "../hooks/use-renter-table";

interface ExpandedRowContentProps {
  user: UserFull;
  document: IdentifyDocumentResponse | null;
  hasDocumentLoaded: boolean;
  onImageClick: (state: ImageModalState) => void;
}

export function ExpandedRowContent({ user, document, hasDocumentLoaded, onImageClick }: ExpandedRowContentProps) {
  return (
    <div className="border-t bg-muted/20 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <User className="size-4" />
            Thông tin cơ bản
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-50">
                {user.isVerify ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <XCircle className="size-5 text-red-600" />
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Trạng thái tài khoản</div>
                <Badge variant={user.isVerify ? "default" : "secondary"} className="text-sm px-3 py-1">
                  {user.isVerify ? "Đã xác thực" : "Chưa xác thực"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                icon={<CalendarPlus className="size-4 text-blue-600" />}
                label="Tạo lúc"
                value={user.createdAt ? formatDate(user.createdAt) : "Chưa xác định"}
              />
              <InfoCard
                icon={<Edit className="size-4 text-amber-600" />}
                label="Cập nhật"
                value={user.updatedAt ? formatDate(user.updatedAt) : "Chưa xác định"}
              />
              <InfoCard
                icon={<UserPlus className="size-4 text-purple-600" />}
                label="Tạo bởi"
                value={user.createdBy || "Hệ thống"}
              />
              <InfoCard
                icon={<User className="size-4 text-cyan-600" />}
                label="Cập nhật bởi"
                value={user.updatedBy || "Chưa cập nhật"}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <FileText className="size-4" />
            Tài liệu
          </h4>
          {!hasDocumentLoaded ? (
            <div className="flex items-center justify-center p-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Đang tải tài liệu...</span>
            </div>
          ) : document ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={<Globe className="size-4 text-indigo-600" />}
                  label="Mã quốc gia"
                  value={document.countryCode || "Chưa có mã quốc gia"}
                />
                <InfoCard
                  icon={<CreditCard className="size-4 text-emerald-600" />}
                  label="Số GPLX"
                  value={document.numberMasked || "Chưa có số GPLX"}
                />
              </div>

              <div className="flex gap-4">
                {/* Front Image */}
                <div className="flex-1 space-y-2">
                  <span className="text-sm text-muted-foreground">Ảnh mặt trước:</span>
                  {document.frontImage ? (
                    <div className="relative group">
                      <img
                        src={getImageUrl(document.frontImage)}
                        alt="Front Document"
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          onImageClick({
                            url: getImageUrl(document.frontImage!),
                            title: `Ảnh mặt trước - ${user.fullName || "Người dùng"}`,
                          });
                        }}
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg border flex items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Eye className="size-3 text-gray-700" />
                          <span className="text-xs font-medium text-gray-700">Click để xem</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-lg border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                      Không có ảnh mặt trước
                    </div>
                  )}
                </div>

                {/* Back Image */}
                <div className="flex-1 space-y-2">
                  <span className="text-sm text-muted-foreground">Ảnh mặt sau:</span>
                  {document.backImage ? (
                    <div className="relative group">
                      <img
                        src={getImageUrl(document.backImage)}
                        alt="Back Document"
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          onImageClick({
                            url: getImageUrl(document.backImage!),
                            title: `Ảnh mặt sau - ${user.fullName || "Người dùng"}`,
                          });
                        }}
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg border flex items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Eye className="size-3 text-gray-700" />
                          <span className="text-xs font-medium text-gray-700">Click để xem</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-lg border border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
                      Không có ảnh mặt sau
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={<Shield className="size-4 text-blue-600" />}
                  label="Xác thực bởi"
                  value={document.verifiedBy || "Chưa được xác thực"}
                />
                <InfoCard
                  icon={<CalendarPlus className="size-4 text-amber-600" />}
                  label="Ngày xác thực"
                  value={document.verifiedAt ? formatDate(document.verifiedAt) : "Chưa xác thực"}
                />
              </div>
              {document.note && (
                <div className="flex items-start gap-2 p-4 rounded-xl border bg-card shadow-sm">
                  <MessageSquare className="size-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Ghi chú</div>
                    <div className="text-sm font-medium">{document.note}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 rounded-lg border bg-muted/30">
              Chưa có tài liệu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted">
        {React.isValidElement(icon) ? icon : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

