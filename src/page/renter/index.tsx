import { Button } from "@/components/ui/button";
import car from "../../images/car.png";
import logo from "../../images/logo.png";
import tienloi from "../../images/tienloi.png";
import thanthien from "../../images/thanthien.png";
import sacTien from "../../images/sactienloi.png";
import tietkiem from "../../images/tietkiem.png";
import ec3 from "../../images/ec3.png";
import ec6 from "../../images/ec6.png";
import ec7 from "../../images/ec7.png";
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
      {/* Thue Xe tu lai */}
      <section className="bg-[#f3f4f6] py-14 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-1xl md:text-2xl font-bold text-gray-900">
              Thuê xe tự lái
            </h2>
            <p className="mt-4 text-black-600 max-w-3xl mx-auto leading-7">
              Với{" "}
              <span className="text-emerald-600 font-semibold">EcoRent</span>,
              bạn hoàn toàn chủ động trong mọi chuyến đi. Dịch vụ thuê xe tự lái
              mang đến sự linh hoạt, riêng tư và tiết kiệm. Chỉ với vài thao tác
              đặt xe, bạn đã có thể nhận xe tại trạm gần nhất và bắt đầu hành
              trình xanh cùng chúng tôi.
            </p>
            <Button className="mt-6 rounded-full px-6 md:px-8 py-5 text-base md:text-lg bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm">
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
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold">Minicar</p>
                    <p className="font-semibold">4 chỗ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold">210km (NEDC)</p>
                    <p className="font-semibold">Dung tích cọp 28SL</p>
                  </div>
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
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold">Sedan</p>
                    <p className="font-semibold">5 chỗ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold">~480km (NEDC)</p>
                    <p className="font-semibold">Dung tích cọp 42SL</p>
                  </div>
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
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold">SUV</p>
                    <p className="font-semibold ">5 chỗ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold">498km (NEDC)</p>
                    <p className="font-semibold ">Dung tích cọp 537L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer End */}
      <section>
        {/* ====== Footer ====== */}
        <footer className="bg-[#0b1625] text-slate-200">
          {/* Top: links */}
          <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Product */}
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Thuê xe tự lái
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Thuê theo ngày
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Bảng giá
                  </a>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Thông tin</h4>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Chính sách &amp; Điều khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Chính sách bảo mật dữ liệu
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-slate-100 font-semibold mb-4">Công ty</h4>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="max-w-6xl mx-auto px-4">
            <hr className="border-white/10" />
          </div>

          {/* Divider */}
          <div className="max-w-6xl mx-auto px-4">
            <hr className="border-white/10" />
          </div>

          {/* Bottom: company details */}
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300">
            <div className="space-y-2">
              <p>© Công ty Cổ phần EcoRent</p>
              <p>
                <span className="text-slate-400">Số GCNĐKKD:</span> 04328823232
              </p>
              <p>
                <span className="text-slate-400">Ngày cấp:</span> 24-09-2025
              </p>
              <p>
                <span className="text-slate-400">Nơi cấp:</span> Sở Kế hoạch và
                Đầu tư TPHCM
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="text-slate-400">Địa chỉ:</span> 7 Đ. D1, Long
                Thạnh Mỹ, Thủ Đức, Hồ Chí Minh 700000, Việt Nam
              </p>
              <p>
                <span className="text-slate-400">Email:</span>{" "}
                support@ecorent.vn
              </p>
              <p>
                <span className="text-slate-400">Số điện thoại:</span> 0900 000
                000
              </p>
              <p>
                <span className="text-slate-400">Tên TK:</span> CTCP ECORENT
                &nbsp;&nbsp;
                <span className="text-slate-400">Số TK:</span> 0912332223
                &nbsp;&nbsp;
                <span className="text-slate-400">Ngân hàng:</span> MBank
              </p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default HomePage;
