import tienloi from "../../../../images/tienloi.png";
import thanthien from "../../../../images/thanthien.png";
import sacTien from "../../../../images/sactienloi.png";
import tietkiem from "../../../../images/tietkiem.png";

export default function WhyEcoRent() {
  return (
    <section style={{ backgroundColor: "#f4fff7" }} className="px-8 py-12">
      <h2 className="text-xl font-bold text-center mb-8">
        Vì sao chọn EcoRent?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <img src={tienloi} alt="Tiện lợi" className="h-40 mb-2" />
          <h3 className="text-2xl font-semibold mb-1">Tiện lợi</h3>
          <p>
            Đặt xe nhanh chóng <br /> tại trạm gần nhất chỉ với vài thao tác.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src={thanthien}
            alt="Thân thiện môi trường"
            className="h-40 mb-2"
          />
          <h3 className="text-2xl font-semibold mb-1">Thân thiện môi trường</h3>
          <p>
            100% xe điện – giảm khí thải, <br /> bảo vệ hành tinh xanh.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <img src={tietkiem} alt="Tiết kiệm chi phí" className="h-40 mb-2" />
          <h3 className="text-2xl font-semibold mb-1">Tiết kiệm chi phí</h3>
          <p>Giá cả minh bạch, tiết kiệm hơn so với xe xăng truyền thống.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <img src={sacTien} alt="Sạc tiện lợi" className="h-40 mb-2" />
          <h3 className="text-2xl font-semibold mb-1">Sạc tiện lợi</h3>
          <p>Hệ thống trạm sạc phủ rộng, hỗ trợ 24/7.</p>
        </div>
      </div>
    </section>
  );
}
