import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { UserAtDepotResponse } from "@/@types/auth.type";
import type { OrderBookingOfflineRequest } from "@/@types/order/order-booking";
import type { CarEV } from "@/@types/car/carEv";
import { carEVAPI } from "@/apis/car-ev.api";
import { orderBookingAPI } from "@/apis/order-booking.api";
import { UserFullAPI } from "@/apis/user.api";
import { useAuthStore } from "@/lib/zustand/use-auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CustomerInfo } from "./components/CustomerInfo";
import { CarSelection } from "./components/CarSelection";
import { DateRangeSelection } from "./components/DateRangeSelection";
import { PaymentMethodSelection } from "./components/PaymentMethodSelection";
import { OrderNote } from "./components/OrderNote";
import { PricingSummary } from "./components/PricingSummary";

function CreateOrderAtDepot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const customer = location.state as UserAtDepotResponse | null;

  const [cars, setCars] = useState<CarEV[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCars, setLoadingCars] = useState(true);
  const [staffDepotId, setStaffDepotId] = useState<string | null>(null);

  const [formData, setFormData] = useState<OrderBookingOfflineRequest>({
    carEVDetailID: "",
    userId: customer?.userId || "",
    startAt: "",
    endAt: "",
    paymentMethod: "CASH",
    note: "",
  });

  const [errors, setErrors] = useState<{
    carEVDetailID?: string;
    startAt?: string;
    endAt?: string;
  }>({});

  // Get staff depot ID
  useEffect(() => {
    const getStaffDepot = async () => {
      if (!user?.userId) return;

      try {
        const userInfo = await UserFullAPI.getDepotByUserId(user.userId);
        setStaffDepotId(userInfo.depotId || null);
      } catch (err) {
        console.error("Error fetching staff depot:", err);
        toast.error("Không lấy được thông tin chi nhánh của nhân viên");
      }
    };

    getStaffDepot();
  }, [user?.userId]);

  // Redirect if no customer data
  useEffect(() => {
    if (!customer) {
      toast.error("Không tìm thấy thông tin khách hàng");
      navigate("/staff/create-user-at-depot");
    }
  }, [customer, navigate]);

  // Fetch cars from staff's depot
  useEffect(() => {
    const fetchCars = async () => {
      if (!staffDepotId) return;

      setLoadingCars(true);
      try {
        const carsData = await carEVAPI.getByDepotId(staffDepotId);
        // Filter only available cars
        const availableCars = carsData.filter(
          (car) => car.status === "AVAILABLE"
        );
        setCars(availableCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        toast.error("Không thể tải danh sách xe");
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, [staffDepotId]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.carEVDetailID) {
      newErrors.carEVDetailID = "Vui lòng chọn xe";
    }

    if (!formData.startAt) {
      newErrors.startAt = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endAt) {
      newErrors.endAt = "Vui lòng chọn ngày kết thúc";
    } else if (new Date(formData.endAt) <= new Date(formData.startAt)) {
      newErrors.endAt = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    try {
      const response = await orderBookingAPI.orderOffline(formData);
      const orderId = response.data.data.orderBooking.id;

      toast.success("Tạo đơn hàng thành công!");

      // Navigate to dashboard or order list with the created order ID
      setTimeout(() => {
        navigate(`/staff/trip/${orderId}/contract`);
      }, 1500);
    } catch (error) {
      console.error("Create order error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Tạo đơn hàng thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tạo đơn hàng thuê xe tại trạm
        </h1>
        <p className="text-gray-600 mt-2">
          Tạo đơn đặt xe cho khách hàng đã đăng ký
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <CustomerInfo customer={customer} />

        {/* Car Selection */}
        <Card className="p-6">
          {loadingCars ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3 text-gray-600">
                Đang tải danh sách xe...
              </span>
            </div>
          ) : (
            <CarSelection
              cars={cars}
              selectedCarId={formData.carEVDetailID}
              onChange={(carId) =>
                setFormData((prev) => ({ ...prev, carEVDetailID: carId }))
              }
              error={errors.carEVDetailID}
            />
          )}
        </Card>

        {/* Date Range Selection */}
        <Card className="p-6">
          <DateRangeSelection
            startAt={formData.startAt}
            endAt={formData.endAt}
            onStartChange={(date) =>
              setFormData((prev) => ({ ...prev, startAt: date }))
            }
            onEndChange={(date) =>
              setFormData((prev) => ({ ...prev, endAt: date }))
            }
            errors={errors}
          />
        </Card>

        {/* Payment Method */}
        <Card className="p-6">
          <PaymentMethodSelection
            paymentMethod={formData.paymentMethod}
            onChange={(method) =>
              setFormData((prev) => ({ ...prev, paymentMethod: method }))
            }
          />
        </Card>

        {/* Pricing Summary */}
        {formData.carEVDetailID && formData.startAt && formData.endAt && (
          <Card className="p-6">
            <PricingSummary
              car={cars.find((c) => c.id === formData.carEVDetailID) || null}
              startAt={formData.startAt}
              endAt={formData.endAt}
              userId={formData.userId}
            />
          </Card>
        )}

        {/* Order Note */}
        <Card className="p-6">
          <OrderNote
            note={formData.note || ""}
            onChange={(note) => setFormData((prev) => ({ ...prev, note }))}
          />
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Quay lại
          </Button>
          <Button type="submit" disabled={loading || loadingCars}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              "Tạo đơn hàng"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrderAtDepot;
