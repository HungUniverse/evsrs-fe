import { useNavigate } from "react-router-dom";
import aboutImage from "@/images/about.jpg";
import logo from "@/images/logo.png";

export default function AboutMioto() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate("/about");
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={aboutImage}
                alt="Happy customer with car"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-bl-full"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            {/* Logo Icon */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-white-400 to-white-500 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={logo} alt="logo" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Bạn muốn biết thêm
              <br />
              về Mioto?
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Mioto kết nối khách hàng có nhu cầu thuê xe với hàng ngàn chủ xe ô
              tô ở TPHCM, Hà Nội & các tỉnh thành khác. Mioto hướng đến việc xây
              dựng cộng đồng người dùng ô tô văn minh & uy tín tại Việt Nam.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleLearnMore}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-700 to-green-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300"
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
