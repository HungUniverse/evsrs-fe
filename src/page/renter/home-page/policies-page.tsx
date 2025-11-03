import { Check, X } from "lucide-react";
import Footer from "../components/layout/footer";

function PoliciesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-100 max-w-7xl mx-auto bg-cover bg-center mt-8 rounded-2xl overflow-hidden"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/6164b6e456de5b11ad2eb200/6196cdb9836b78264a3bb55a_BaxTowner_Automotive_Subaru-BA107468.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4">
            Chính sách & Quy định
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-14">
        {/* Cancel Policy Section */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-3 ">
            Chính sách hủy chuyến
          </h2>

          <p className="text-gray-800 text-lg mb-6 leading-relaxed">
            Để đảm bảo quyền lợi của khách hàng và tối ưu vận hành tại các trạm
            thuê, EcoRent áp dụng chính sách hủy chuyến như sau:
          </p>

          <div className="max-w-7xl mx-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-1/2 px-6 py-3 text-left text-md font-semibold text-gray-800 text-lg border-b border-gray-300">
                    Thời Điểm Hủy Chuyến
                  </th>
                  <th className="w-1/2 px-6 py-3 text-left text-md font-semibold text-gray-800 text-lg border-b border-gray-300">
                    Phí Hủy Chuyến
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Row 1 */}
                <tr className="bg-white">
                  <td className="px-6 py-4 text-md text-gray-800 border-b border-gray-200">
                    Trong vòng <strong>24 giờ</strong> sau khi đặt cọc
                  </td>
                  <td className="px-6 py-4 text-md text-gray-800 border-b border-gray-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Miễn phí
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="bg-white">
                  <td className="px-6 py-4 text-md text-gray-800 border-b border-gray-200">
                    Sau 24 giờ nhưng <strong>trước thời gian nhận xe</strong>
                  </td>
                  <td className="px-6 py-4 text-md text-gray-800 border-b border-gray-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Phí 50% tiền cọc
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="bg-white">
                  <td className="px-6 py-4 text-md text-gray-800">
                    Sau giờ nhận xe đã thỏa thuận hoặc{" "}
                    <strong>đã ký hợp đồng</strong>
                  </td>
                  <td className="px-6 py-4 text-md text-gray-800 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    Giữ toàn bộ tiền cọc (30%)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-md text-gray-800 text-lg">
            <strong>Lưu ý:</strong> Việc hủy chuyến phải được thực hiện trên ứng
            dụng/website trước thời điểm nhận xe. Sau khi hợp đồng có hiệu lực,
            mọi yêu cầu hủy đều không được chấp nhận.
          </p>
        </section>

        {/* Pickup Policy */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-3 ">
            1. Chính sách nhận xe
          </h2>

          <div className="space-y-4">
            <p className="text-gray-800 text-lg leading-relaxed">
              • Khách hàng phải xuất trình{" "}
              <strong>Giấy phép lái xe (GPLX)</strong> bản gốc để đối chiếu
              thông tin đã đăng ký.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Xe được bàn giao kèm biên bản bàn giao xe điện tử gồm hình ảnh 4
              góc, mức pin, số km, và phụ kiện đi kèm.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu khách hàng không đến nhận xe trong vòng{" "}
              <strong>1 giờ sau giờ hẹn</strong> → đơn hàng tự động hủy và mất
              toàn bộ tiền cọc.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Sau khi kiểm tra và ký biên bản, khách hàng thanh toán phần còn
              lại (70%) để hoàn tất thủ tục nhận xe.
            </p>
          </div>
        </section>

        {/* Return Policy */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-3">
            2. Chính sách trả xe
          </h2>

          <div className="space-y-4">
            <p className="text-gray-800 text-lg leading-relaxed">
              • Xe phải được trả đúng thời gian và địa điểm ghi trong hợp đồng
              (trừ khi có đăng ký trả tại chi nhánh khác).
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu trả muộn hơn thời gian thỏa thuận, hệ thống sẽ tính{" "}
              <strong>phí vượt giờ</strong> theo quy định (1.5 lần giá gốc/giờ).
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu giữ xe quá 6 giờ mà không báo trước, hệ thống có quyền tính
              phí phạt lên đến <strong>2 lần giá thuê/ngày</strong>.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Xe phải được trả trong tình trạng ban đầu, đối chiếu theo biên
              bản bàn giao.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu xe hư hỏng, trầy xước hoặc thiếu phụ kiện, khách hàng phải
              bồi thường theo báo giá chính hãng.
            </p>
          </div>
        </section>

        {/* Responsibility Policy */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-3">
            3. Chính sách trách nhiệm & vi phạm
          </h2>

          <div className="space-y-4">
            <p className="text-gray-800 text-lg leading-relaxed">
              • Khách hàng hoàn toàn chịu trách nhiệm trước pháp luật về mọi
              hành vi vi phạm trong thời gian thuê.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nghiêm cấm việc cho thuê lại, cầm cố, thế chấp xe dưới mọi hình
              thức.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu xe bị giữ, tạm giữ hoặc gây tai nạn, khách hàng phải chịu
              toàn bộ chi phí phát sinh và phối hợp với chủ xe, cơ quan chức
              năng để giải quyết.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Trường hợp vi phạm nghiêm trọng, EcoRent có quyền khóa tài khoản
              và từ chối phục vụ trong tương lai.
            </p>
          </div>
        </section>

        {/* Pricing Policy */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-6">
            4. Chi phí thuê xe & dịch vụ liên quan
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-black mb-3 text-lg">
                Giá thuê cơ bản:
              </h3>
              <p className="text-gray-800 text-lg mb-2">
                <strong>Giá thuê:</strong> 500.000 – 1.200.000 VNĐ/ngày (tùy
                dòng xe)
              </p>
              <p className="text-gray-800 text-lg">
                <strong>Đặt cọc:</strong> 30% giá trị đơn hàng, thanh toán trong
                1 giờ sau khi đặt. Phần còn lại sẽ trả sau khi kí hợp đồng
              </p>
            </div>

            <div>
              <h3 className="font-bold  text-black mb-3 text-lg ">
                Phí sử dụng:
              </h3>
              <p className="text-gray-800 text-lg">
                • Phí sạc điện: quy đổi 1% pin = giá tiền điện hiện hành/kWh
              </p>
              <p className="text-gray-800 text-lg">
                • Phí vượt km: 3.000 – 5.000 VNĐ/km (Tùy loại xe)
              </p>
              <p className="text-gray-800 text-lg">
                • Phí vượt giờ: 1.5 lần giá thuê/giờ
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-3 text-lg">
                Dịch vụ khác:
              </h3>
              <p className="text-gray-800 text-lg">
                • Vệ sinh xe: 200.000 – 500.000 VNĐ nếu bẩn vượt mức
              </p>
              <p className="text-gray-800 text-lg">
                • Mất giấy tờ/chìa khóa: 1.000.000 – 3.000.000 VNĐ
              </p>
              <p className="text-gray-800 text-lg">
                • Cứu hộ hết pin: 500.000 – 1.000.000 VNĐ/lần
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-3 text-lg">
                Phí trả xe khác chi nhánh:
              </h3>
              <p className="text-gray-800 text-lg">
                200.000 – 500.000 VNĐ/lần, hoặc 10.000 – 15.000 VNĐ/km
              </p>
            </div>
          </div>
        </section>

        {/* Note Section */}
        <section className="border-t-2 border-black pt-8">
          <h3 className="text-xl font-bold text-black mb-4">Lưu ý chung</h3>
          <div className="space-y-3 text-gray-800 text-lg">
            <p>
              Tất cả giao dịch thuê xe đều được thực hiện qua hệ thống{" "}
              <strong>EcoRent</strong>, có hợp đồng điện tử và biên bản bàn giao
              xác nhận giữa hai bên.
            </p>
            <p>
              Mọi tranh chấp (nếu có) sẽ được xử lý theo quy định của pháp luật
              Việt Nam và chính sách của EcoRent.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default PoliciesPage;
