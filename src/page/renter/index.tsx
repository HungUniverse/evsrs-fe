import { Button } from "@/components/ui/button";
import car from "../../images/car.png";
import logo from "../../images/logo.png";
import tienloi from "../../images/tienloi.png";
import thanthien from "../../images/thanthien.png";
import sacTien from "../../images/sactienloi.png";
import tietkiem from "../../images/tietkiem.png";
function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-black text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="EcoRent" className="h-14" />
          <span className="text-2xl font-bold text-green-400 mt-2">
            EcoRent
          </span>
        </div>
        <nav className="text-lg flex gap-8">
          <a
            href="/"
            className="font-semibold text-green-400 font-bold hover:text-green-300 transition-colors"
          >
            Trang chủ
          </a>
          <a
            href="#"
            className="font-semibold hover:text-green-400 transition-colors"
          >
            Giá dịch vụ
          </a>
          <a
            href="#"
            className="font-semibold hover:text-green-400 transition-colors"
          >
            Vì chúng tôi
          </a>
          <a
            href="#"
            className="font-semibold hover:text-green-400 transition-colors"
          >
            Liên hệ
          </a>
        </nav>
        <Button className="bg-green-500 text-white px-7 py-6 rounded-full">
          Đăng nhập
        </Button>
      </header>
      <section className="relative w-full h-[650px] flex items-center justify-center overflow-hidden p-0 m-0">
        <img
          src={car}
          alt="Car"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="self-start w-full max-w-[900px] text-7xl mx-auto font-bold text-green-400 mb-2 text-left drop-shadow-lg">
            Thuê xe điện dễ dàng, tiện lợi tại trạm gần bạn
          </h1>
          <p className="self-start w-full max-w-[900px] mb-4 text-3xl mx-auto text-left text-white drop-shadow-lg mt-8">
            Trải nghiệm di chuyển xanh – tiết kiệm và bền vững cùng{" "}
            <span className="text-green-400 font-semibold">EcoRent</span>.
          </p>
          <Button className="bg-green-500 hover:bg-green-700 text-white px-20 py-8 rounded-full shadow-lg text-3xl font-bold">
            Thuê xe
          </Button>
        </div>
        <div className="absolute inset-0 bg-black/50" />
      </section>
      {/* Why EcoRent */}
      <section style={{ backgroundColor: "#f4fff7" }} className=" px-8 py-12">
        <h2 className="text-xl font-bold text-center mb-8">
          Vì sao chọn EcoRent?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-left">
            <img src={tienloi} alt="Tiện lợi" className="h-40 mb-2" />
            <h3 className="text-2xl font-semibold mb-1">Tiện lợi</h3>
            <p className="te">
              Đặt xe nhanh chóng <br /> tại trạm gần nhất chỉ với vài thao tác.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img
              src={thanthien}
              alt="Thân thiện môi trường"
              className="h-40 mb-2"
            />
            <h3 className="text-2xl font-semibold mb-1">
              Thân thiện môi trường
            </h3>
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
    </div>
  );
}

export default HomePage;
