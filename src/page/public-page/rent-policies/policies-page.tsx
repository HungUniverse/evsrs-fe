import Footer from "../../renter/components/layout/footer";
import { SystemConfigUtils } from "@/hooks/use-system-config";

function PoliciesPage() {
  const systemDepositPercent = SystemConfigUtils.getDepositPercent();

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
          <h2 className="text-4xl font-semibold text-black mb-3">
            1. Chính sách hủy chuyến
          </h2>

          <div className="space-y-4 text-gray-800 text-lg leading-relaxed">
            <p>
              Để đảm bảo quyền lợi của khách hàng và tối ưu vận hành tại các
              trạm thuê, EcoRent áp dụng chính sách hủy chuyến như sau:
            </p>

            <p>
              • Khách hàng có thể hủy chuyến bất kỳ lúc nào{" "}
              <strong>trước thời điểm nhận xe</strong> đã thỏa thuận.
            </p>

            <p>
              • Khi hủy chuyến, khách hàng sẽ{" "}
              <strong>mất toàn bộ tiền cọc</strong> ({systemDepositPercent}% giá
              trị đơn hàng).
            </p>

            <p>
              • Nếu khách hàng không đến nhận xe trong vòng{" "}
              <strong>1 giờ sau giờ hẹn</strong>, đơn hàng sẽ tự động hủy và mất
              toàn bộ tiền cọc.
            </p>

            <p className="italic text-gray-600">
              <strong>Lưu ý:</strong> Sau khi hợp đồng có hiệu lực (đã nhận xe),
              mọi yêu cầu hủy đơn đều không được chấp nhận.
            </p>
          </div>
        </section>

        {/* Pickup Policy */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-3 ">
            2. Chính sách nhận xe
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
            3. Chính sách trả xe
          </h2>

          <div className="space-y-4">
            <p className="text-gray-800 text-lg leading-relaxed">
              • Xe phải được trả đúng thời gian và địa điểm ghi trong hợp đồng
              (trừ khi có đăng ký trả tại chi nhánh khác).
            </p>
            <p className="text-gray-800 text-lg leading-relaxed">
              {" "}
              • Đối với các đơn hàng trả xe trong khung giờ từ 6:00 đến 7:00
              sáng, hệ thống sẽ <strong>miễn tính phí</strong> ca sáng. Nếu trả
              xe sau 7:00 sáng, thời gian này sẽ được{" "}
              <strong>tính phí thuê</strong> như bình thường.{" "}
            </p>
            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu trả muộn hơn thời gian thỏa thuận, nhân viên quản lý trạm sẽ
              tính <strong>phí vượt giờ</strong> theo quy định.
            </p>

            <p className="text-gray-800 text-lg leading-relaxed">
              • Nếu giữ xe quá 6 giờ mà không báo trước, nhân viên quản lý có
              quyền tính phí phạt lên đến <strong>2 lần giá thuê/ngày</strong>.
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
            4. Chính sách trách nhiệm & vi phạm
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
        {/* Pricing Policy */}
        <section className="mb-8">
          <h2 className="text-4xl font-semibold text-black mb-6">
            5. Giá thuê xe & Phí dịch vụ
          </h2>

          <div className="space-y-5 text-gray-800 text-lg leading-relaxed">
            <p>
              • <strong>Giá thuê cơ bản:</strong> từ 500.000 – 1.200.000
              VNĐ/ngày (tùy dòng xe).
            </p>

            <p>
              • Hệ thống chia 2 <strong>ca thuê trong ngày</strong>:{" "}
              <strong>Ca sáng</strong> từ 06:00 – 12:00 (40% giá ngày) và{" "}
              <strong>Ca chiều</strong> từ 12:30 – 22:00 (60% giá ngày). Nếu
              khách thuê ca sáng và trả xe trong ca chiều cùng ngày thì được
              tính giá trọn ngày.
            </p>

            <p>
              • <strong>Đặt cọc:</strong> {systemDepositPercent}% giá trị đơn
              hàng, thanh toán trong vòng 1 giờ sau khi đặt. Phần còn lại được
              thanh toán khi ký hợp đồng.
            </p>

            <p>
              • <strong>Phí sạc điện:</strong> quy đổi 1% pin = đơn giá điện
              hiện hành (VNĐ/kWh).
            </p>

            <p>
              • <strong>Phí vượt km:</strong> 3.000 – 5.000 VNĐ/km (tùy loại
              xe).
            </p>

            <p>
              • <strong>Phí vượt giờ:</strong> 1.5 lần giá thuê/giờ.
            </p>

            <p>
              • <strong>Dịch vụ khác:</strong> Vệ sinh xe (200.000 – 500.000
              VNĐ), mất giấy tờ hoặc chìa khóa (1.000.000 – 3.000.000 VNĐ), cứu
              hộ hết pin (500.000 – 1.000.000 VNĐ/lần).
            </p>

            <p>
              • <strong>Phí trả xe khác chi nhánh:</strong> 200.000 – 500.000
              VNĐ/lần, hoặc 10.000 – 15.000 VNĐ/km (tùy khoảng cách).
            </p>

            <p className="italic text-gray-600">
              *Mức giá trên chưa bao gồm phụ phí phát sinh (hư hỏng, hoặc các
              chi phí đặc biệt khác nếu có).
            </p>
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
