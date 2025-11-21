import { useEffect, useMemo, useState } from "react";
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
import { useDepotsByModel } from "@/hooks/use-depot-by-model";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { vnd } from "@/lib/utils/currency";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { Model } from "@/@types/car/model";
import { MembershipAPI } from "@/apis/membership.api";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import type { OrderBookingDetail } from "@/@types/order/order-booking";

type Props = {
  car: Model;
  searchForm: { location: string; start: string; end: string };
  onTimeChange?: (start: string, end: string) => void;
};

export default function BookingForm({ car, searchForm, onTimeChange }: Props) {
  const [selectedDepotId, setSelectedDepotId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [hasIncompleteOrder, setHasIncompleteOrder] = useState(false);
  const [checkingOrders, setCheckingOrders] = useState(true);

  const { user } = useAuthStore();

  // Check for incomplete orders
  useEffect(() => {
    const checkIncompleteOrders = async () => {
      if (!user?.userId) {
        setCheckingOrders(false);
        return;
      }

      try {
        const response = await orderBookingAPI.getByUserId(user.userId);
        const orders: OrderBookingDetail[] = response.data.data;

        const incompleteStatuses = [
          "PENDING",
          "CONFIRMED",
          "READY_FOR_CHECKOUT",
          "CHECKED_OUT",
          "IN_USE",
          "RETURNED",
        ];

        const hasIncomplete = orders.some((order) =>
          incompleteStatuses.includes(order.status)
        );

        setHasIncompleteOrder(hasIncomplete);
      } catch (error) {
        console.error("Failed to check orders:", error);
        setHasIncompleteOrder(false);
      } finally {
        setCheckingOrders(false);
      }
    };

    checkIncompleteOrders();
  }, [user?.userId]);

  // Fetch membership discount
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const membership = await MembershipAPI.getMyMembership();
        setMembershipDiscount(membership.discountPercent || 0);
      } catch (error) {
        console.error("Failed to fetch membership:", error);
        setMembershipDiscount(0);
      }
    };
    fetchMembership();
  }, []);

  const { deposit } = useBookingCalc(
    car.price,
    searchForm.start,
    searchForm.end,
    car.sale,
    membershipDiscount
  );
  const navigate = useNavigate();

  // Get depot list for the model
  const { data: depotData = [] } = useDepotsByModel({
    modelId: car.id,
    province: searchForm.location,
  });

  // Transform depot data to DepotLite format
  const depots = useMemo(() => {
    return depotData.map(({ depot }) => ({
      id: depot.id,
      name: depot.name,
      province: depot.province,
      district: depot.district,
      street: depot.street,
      openTime: depot.openTime,
      closeTime: depot.closeTime,
    }));
  }, [depotData]);

  useEffect(() => {
    setSelectedDepotId("");
  }, [car.id, searchForm.location]);

  const canSubmit = useMemo(
    () =>
      !!selectedDepotId &&
      !!paymentMethod &&
      !isSubmitting &&
      !hasIncompleteOrder,
    [selectedDepotId, paymentMethod, isSubmitting, hasIncompleteOrder]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      // Navigate to payment page with booking data
      // The actual order creation will happen in payment page
      navigate("/payment", {
        state: {
          amount: deposit,
          model: car,
          depotId: selectedDepotId,
          paymentMethod,
          notes,
          searchForm,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Có lỗi xảy ra khi đặt xe. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <UserInfo />

              <div>
                <h3 className="text-lg font-semibold mb-4">Nơi nhận xe</h3>
                <AddressSelect
                  key={`${car.id}-${searchForm.location}`}
                  province={searchForm.location}
                  modelId={car.id}
                  value={selectedDepotId}
                  onChange={setSelectedDepotId}
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
                    <SelectItem value="BANKING">
                      Chuyển khoản ngân hàng (SePay)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <a
                      href="/policies"
                      className="text-blue-600 hover:underline"
                    >
                      Điều khoản thanh toán của EcoRent
                    </a>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="privacy" required />
                  <Label htmlFor="privacy" className="text-sm text-slate-600">
                    Tôi đồng ý để lại thông tin cá nhân theo{" "}
                    <a
                      href="/security-policies"
                      className="text-blue-600 hover:underline"
                    >
                      Điều khoản chia sẻ dữ liệu cá nhân của EcoRent
                    </a>
                  </Label>
                </div>
              </div>
              {hasIncompleteOrder && (
                <p className="text-red-600 font-medium text-md text-center ">
                  Bạn đang có đơn hàng chưa hoàn thành, không thể đặt đơn khác.
                </p>
              )}
              <Button
                type="submit"
                disabled={!canSubmit || checkingOrders}
                className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {checkingOrders
                  ? "Đang kiểm tra..."
                  : isSubmitting
                    ? "Đang xử lý..."
                    : `Thanh toán ${vnd(deposit)} VND`}
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 p-6">
            <PaymentSection
              car={car}
              searchForm={searchForm}
              depotId={selectedDepotId}
              depots={depots}
              onTimeChange={onTimeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
