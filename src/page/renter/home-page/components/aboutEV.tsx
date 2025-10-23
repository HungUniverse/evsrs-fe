import {
  CheckCircle,
  Leaf,
  Shield,
  Sparkles,
  Users,
  Zap,
  MapPin,
  Clock,
} from "lucide-react";
import Footer from "../../components/layout/footer";

// If you're using Next.js App Router, you can put this file at: app/(marketing)/about/page.tsx
// For Pages Router or Vite SPA, save as: src/pages/about.tsx (or src/home-page/components/aboutUs.tsx and route to it)
// Styling assumes Tailwind CSS. Feel free to swap to your design system.

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="w-6 h-6" aria-hidden />,
      title: "Xanh & bền vững",
      desc: "Giảm phát thải CO₂ bằng đội xe 100% điện, ưu tiên sạc từ nguồn tái tạo tại hệ thống trạm đối tác.",
    },
    {
      icon: <Shield className="w-6 h-6" aria-hidden />,
      title: "An toàn & minh bạch",
      desc: "Bảo hiểm, theo dõi hành trình, kiểm tra pin/động cơ định kỳ và hợp đồng điện tử rõ ràng.",
    },
    {
      icon: <Zap className="w-6 h-6" aria-hidden />,
      title: "Nhanh & tiện lợi",
      desc: "Đặt xe trong 60 giây, nhận/trả tại trạm gần bạn, hỗ trợ 24/7 qua ứng dụng và hotline.",
    },
    {
      icon: <Users className="w-6 h-6" aria-hidden />,
      title: "Lấy người dùng làm trung tâm",
      desc: "Giá linh hoạt theo giờ/ngày/tháng, nhiều hạng xe, ưu đãi sinh viên và doanh nghiệp.",
    },
  ];

  const milestones = [
    {
      year: "2023",
      text: "Khởi nguồn ý tưởng EcoRent – giải pháp thuê xe điện theo trạm.",
    },
    {
      year: "2024",
      text: "Ra mắt MVP tại TP.HCM với 10 trạm sạc đối tác và >1.000 chuyến đầu tiên.",
    },
    {
      year: "2025",
      text: "Mở rộng 35+ trạm, tích hợp bản đồ sạc, tự động hóa kiểm tra pin & đặt lịch bảo dưỡng.",
    },
  ];

  const stats = [
    { label: "Trạm đối tác", value: "35+" },
    { label: "Chuyến đi an toàn", value: "25.000+" },
    { label: "CO₂ tránh phát thải*", value: "180 tấn" },
  ];

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Collage Left */}
              <div className="order-1 lg:order-none">
                <div className="relative h-[460px] w-full">
                  <img
                    src="https://otohoangkim-storage.sgp1.cdn.digitaloceanspaces.com/2024-kia-seltos-xanh.webp"
                    alt="Hành trình xanh cùng EcoRent"
                    className="absolute left-0 top-0 h-[460px] w-[74%] object-cover rounded-3xl shadow-sm"
                  />
                </div>
              </div>

              {/* Text Right */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm">
                  <Sparkles className="w-4 h-4" /> Câu chuyện về chúng tôi
                </span>
                <h1 className="mt-4 text-4xl/tight sm:text-5xl/tight font-extrabold tracking-tight">
                  Về <span className="text-emerald-600">EcoRent</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  EcoRent là nền tảng thuê xe điện theo mô hình trạm – giúp mọi
                  người di chuyển xanh dễ dàng, tiết kiệm và bền vững. Chúng tôi
                  kết nối người dùng với mạng lưới trạm sạc và đối tác vận hành
                  để mang lại trải nghiệm thuận tiện ở mọi nơi.
                </p>
                <ul className="mt-6 space-y-3 text-gray-700">
                  {[
                    "Đặt – Nhận – Trả linh hoạt tại trạm gần bạn",
                    "Giá trọn gói minh bạch, không chi phí ẩn",
                    "Hỗ trợ 24/7, cứu hộ trong trường hợp khẩn cấp",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="border-t bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold">Sứ mệnh & tầm nhìn</h2>
                <p className="mt-2 text-gray-600">
                  Chúng tôi tin rằng giao thông đô thị có thể sạch hơn – khi
                  chuyển từ sở hữu sang dùng chung xe điện.
                </p>
              </div>
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-2 bg-emerald-50 text-emerald-700">
                        {v.icon}
                      </div>
                      <h3 className="font-semibold">{v.title}</h3>
                    </div>
                    <p className="mt-3 text-gray-600">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-2xl font-bold">Cách EcoRent hoạt động</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Đặt xe",
                  desc: "Chọn trạm gần bạn, thời gian thuê và hạng xe trong ứng dụng.",
                  icon: <MapPin className="w-6 h-6" />,
                },
                {
                  step: "2",
                  title: "Nhận xe",
                  desc: "Xác thực tài khoản, kiểm tra nhanh tình trạng xe & mức pin, ký HĐ điện tử.",
                  icon: <Shield className="w-6 h-6" />,
                },
                {
                  step: "3",
                  title: "Trả xe",
                  desc: "Kết thúc hành trình tại trạm đã chọn, hệ thống tự tính phí minh bạch.",
                  icon: <Clock className="w-6 h-6" />,
                },
              ].map((i) => (
                <div
                  key={i.step}
                  className="relative rounded-2xl border p-6 bg-white shadow-sm"
                >
                  <div className="absolute -top-3 -left-3 rounded-full bg-emerald-600 text-white w-8 h-8 flex items-center justify-center font-bold">
                    {i.step}
                  </div>
                  <div className="flex items-center gap-3 text-emerald-700">
                    {i.icon}
                    <h3 className="font-semibold">{i.title}</h3>
                  </div>
                  <p className="mt-2 text-gray-600">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-2xl font-bold">Các cột mốc</h2>
            <ol className="mt-6 relative border-s pl-8">
              {milestones.map((m, idx) => (
                <li key={idx} className="mb-8 ms-6">
                  <span className="absolute -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white text-base font-bold">
                    {m.year}
                  </span>
                  <p className="text-gray-700">{m.text}</p>
                </li>
              ))}
            </ol>
            <p className="text-xs text-gray-500 mt-4">
              *Ước tính dựa trên hệ số phát thải trung bình cho xe xăng đô thị.
            </p>
          </div>
        </section>

        {/* Impact / Stats */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid sm:grid-cols-3 gap-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border bg-white p-6 text-center shadow-sm"
                >
                  <div className="text-4xl font-extrabold text-emerald-700">
                    {s.value}
                  </div>
                  <div className="mt-2 text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
