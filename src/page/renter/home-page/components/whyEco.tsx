import tienloi from "../../../../images/tienloi.svg";
import thanthien from "../../../../images/thanthien.png";
import sacTien from "../../../../images/sactienloi.png";
import tietkiem from "../../../../images/tietkiemchiphi.svg";

export default function WhyEcoRent() {
  return (
    <section className="bg-gradient-to-b from-emerald-50 to-white px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
          Vì sao chọn EcoRent?
        </h2>
        <p className="text-center text-gray-600 mb-16 text-lg">
          Trải nghiệm thuê xe điện hiện đại, thân thiện và tiết kiệm
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <div className="mb-6">
              <img src={tienloi} alt="Tiện lợi" className="h-40 w-40 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Tiện lợi</h3>
            <p className="text-gray-600 leading-relaxed">
              Đặt xe nhanh chóng tại trạm gần nhất chỉ với vài thao tác
            </p>
          </div>

          <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <div className="mb-6">
              <img
                src={thanthien}
                alt="Thân thiện môi trường"
                className="h-40 w-40 mx-auto"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Thân thiện môi trường
            </h3>
            <p className="text-gray-600 leading-relaxed">
              100% xe điện – giảm khí thải, bảo vệ hành tinh xanh
            </p>
          </div>

          <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <div className="mb-6">
              <img
                src={tietkiem}
                alt="Tiết kiệm chi phí"
                className="h-40 w-40 mx-auto"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Tiết kiệm chi phí
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Giá cả minh bạch, tiết kiệm hơn so với xe xăng truyền thống
            </p>
          </div>

          <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <div className="mb-6">
              <img
                src={sacTien}
                alt="Sạc tiện lợi"
                className="h-40 w-40 mx-auto"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Sạc tiện lợi
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Hệ thống trạm sạc phủ rộng, hỗ trợ 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
