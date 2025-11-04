import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PaymentMethod } from "@/@types/enum";
import { Card } from "@/components/ui/card";

interface PaymentMethodSelectionProps {
  paymentMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelection({
  paymentMethod,
  onChange,
}: PaymentMethodSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Phương thức thanh toán
      </h2>
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) => onChange(value as PaymentMethod)}
      >
        <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="CASH" id="cash" />
            <Label htmlFor="cash" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold">Tiền mặt</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán trực tiếp bằng tiền mặt
                  </p>
                </div>
              </div>
            </Label>
          </div>
        </Card>

        <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="BANKING" id="banking" />
            <Label htmlFor="banking" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold">Chuyển khoản</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán qua chuyển khoản ngân hàng
                  </p>
                </div>
              </div>
            </Label>
          </div>
        </Card>
      </RadioGroup>
    </div>
  );
}
