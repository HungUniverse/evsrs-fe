import { Card } from "@/components/ui/card";
import type { UserAtDepotResponse } from "@/@types/auth.type";

interface CustomerInfoProps {
  customer: UserAtDepotResponse;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Thông tin khách hàng
      </h2>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Họ và tên
            </label>
            <p className="mt-1 text-gray-900">{customer.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Số điện thoại
            </label>
            <p className="mt-1 text-gray-900">{customer.phoneNumber}</p>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900">{customer.userEmail}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
