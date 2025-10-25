import { Button } from "@/components/ui/button";
import ec3 from "../../../../images/ec3.png";
import ec6 from "../../../../images/ec6.png";
import ec7 from "../../../../images/ec7.png";
import { useNavigate } from "react-router-dom";

export default function SelfDriveSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f3f4f6] py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-1xl md:text-2xl font-bold text-gray-900">
            Thuê xe tự lái
          </h2>
          <p className="mt-4 text-black-600 max-w-3xl mx-auto leading-7">
            Với <span className="text-emerald-600 font-semibold">EcoRent</span>,
            bạn hoàn toàn chủ động trong mọi chuyến đi. Dịch vụ thuê xe tự lái
            mang đến sự linh hoạt, riêng tư và tiết kiệm. Chỉ với vài thao tác
            đặt xe, bạn đã có thể nhận xe tại trạm gần nhất và bắt đầu hành
            trình xanh cùng chúng tôi.
          </p>
          <Button
            className="mt-6 rounded-full px-6 md:px-8 py-5 text-base md:text-lg bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm"
            onClick={() => navigate("/search-car")}
          >
            Xem chi tiết
          </Button>
        </div>

        {/* Hiển thị 3 card xe */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* EC3 */}
          <div className="rounded-2xl p-6 bg-[#454545] text-white shadow-lg ">
            <p className="text-2xl ml-2 font-semibold mb-2 opacity-90">
              Ecofast EC3
            </p>
            <div className="rounded-xl bg-black/10 overflow-hidden grid place-items-center mb-4">
              <img
                src={ec3}
                alt="Ecofast EC3"
                className="object-contain h-full w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold">Minicar</p>
                <p className="font-semibold">4 chỗ</p>
              </div>
              <div>
                <p className="font-semibold">210km (NEDC)</p>
                <p className="font-semibold">Dung tích cọp 28SL</p>
              </div>
            </div>
          </div>

          {/* EC6 */}
          <div className="rounded-2xl p-6 bg-[#454545] text-white shadow-lg">
            <p className="text-2xl ml-2 font-semibold mb-2 opacity-90">
              Ecofast EC6
            </p>
            <div className="rounded-xl bg-black/10 overflow-hidden grid place-items-center mb-4">
              <img
                src={ec6}
                alt="Ecofast EC6"
                className="object-contain h-full w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold">Sedan</p>
                <p className="font-semibold">5 chỗ</p>
              </div>
              <div>
                <p className="font-semibold">~480km (NEDC)</p>
                <p className="font-semibold">Dung tích cọp 42SL</p>
              </div>
            </div>
          </div>

          {/* EC7 */}
          <div className="rounded-2xl p-6 bg-[#454545] text-white shadow-lg">
            <p className="text-2xl ml-2 font-semibold mb-2 opacity-90">
              Ecofast EC7
            </p>
            <div className="rounded-xl bg-black/10 overflow-hidden grid place-items-center mb-4">
              <img
                src={ec7}
                alt="Ecofast EC7"
                className="object-contain h-full w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold">SUV</p>
                <p className="font-semibold ">5 chỗ</p>
              </div>
              <div>
                <p className="font-semibold">498km (NEDC)</p>
                <p className="font-semibold ">Dung tích cọp 537L</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
