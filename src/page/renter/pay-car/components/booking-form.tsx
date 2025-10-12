import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressSelect from "./address-section";
import UserInfo from "./user-info";
import PaymentSection from "./payment-section";
import { useBookingCalc } from "@/hooks/use-booking-car-cal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { vnd } from "@/lib/utils/currency";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type Props = {
  car: Car;
  searchForm: {
    location: string;
    start: string;
    end: string;
  };
};

export default function BookingForm({ car, searchForm }: Props) {
  const [selectedDepot, setSelectedDepot] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { deposit } = useBookingCalc(
    car.pricePerDay,
    searchForm.start,
    searchForm.end
  );
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      navigate("/payment", {
        state: {
          amount: deposit,
          car,
          depot: selectedDepot,
          paymentMethod,
          notes,
          searchForm,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Có lỗi xảy ra khi đặt xe. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Đăng ký thuê xe</h1>
          <button className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <UserInfo />

              <div>
                <h3 className="text-lg font-semibold mb-4">Nơi nhận xe</h3>
                <AddressSelect
                  province={searchForm.location}
                  value={selectedDepot}
                  onChange={setSelectedDepot}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-600">
                  Phương thức thanh toán *
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">
                      Chuyển khoản ngân hàng(SePay)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm text-slate-600">Ghi chú</label>
                <Input
                  placeholder="Nhập ghi chú nếu có..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-slate-600">
                    Bạn đã đọc và đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản thanh toán của EcoRent
                    </a>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="privacy" required />
                  <Label htmlFor="privacy" className="text-sm text-slate-600">
                    Tôi đồng ý để lại thông tin cá nhân theo{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản chia sẻ dữ liệu cá nhân của EcoRent
                    </a>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!selectedDepot || !paymentMethod || isSubmitting}
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : `Thanh toán ${vnd(deposit)}Vnd`}
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 p-6">
            <PaymentSection
              car={car}
              searchForm={searchForm}
              depotMapId={selectedDepot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
