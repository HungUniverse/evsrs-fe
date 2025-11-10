import Footer from "@/page/renter/components/layout/footer";

function SecurityPolicies() {
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
            Chính sách bảo mật dữ liệu cá nhân
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">1. Giới thiệu</h2>

          <p className="text-gray-700 leading-relaxed">
            EcoRent tôn trọng và cam kết bảo vệ thông tin cá nhân của người dùng
            theo Nghị định 13/2023/NĐ-CP. Khi bạn sử dụng nền tảng EcoRent
            (website hoặc ứng dụng), bạn đồng ý cho phép chúng tôi thu thập, lưu
            trữ và xử lý thông tin cá nhân để cung cấp dịch vụ thuê xe điện.
          </p>
        </section>

        {/* Data Collection Scope */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">
            2. Phạm vi thu thập dữ liệu
          </h2>

          <p className="text-gray-700 mb-4 leading-relaxed">
            Tùy theo loại tài khoản:
          </p>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <strong>Người thuê xe:</strong> Họ tên, CCCD/GPLX, số điện thoại,
              email, địa chỉ, thông tin thanh toán.
            </p>

            <p className="text-gray-700 leading-relaxed">
              <strong>Nhân viên/điểm thuê:</strong> Thông tin định danh, vị trí
              làm việc, tài khoản quản lý.
            </p>

            <p className="text-gray-700 leading-relaxed">
              <strong>Dữ liệu hệ thống:</strong> Hành vi truy cập, lịch sử đặt
              xe, thời gian, và vị trí giao nhận.
            </p>
          </div>
        </section>

        {/* Purpose of Use */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">
            3. Mục đích sử dụng
          </h2>

          <p className="text-gray-700 mb-4 leading-relaxed">
            Dữ liệu được dùng để:
          </p>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              • Xác minh danh tính và đảm bảo an toàn khi giao dịch.
            </p>

            <p className="text-gray-700 leading-relaxed">
              • Hỗ trợ đặt xe, thanh toán, và quản lý hợp đồng.
            </p>

            <p className="text-gray-700 leading-relaxed">
              • Cải thiện trải nghiệm người dùng, xử lý khiếu nại và hỗ trợ
              khách hàng.
            </p>

            <p className="text-gray-700 leading-relaxed">
              • Tuân thủ yêu cầu của cơ quan quản lý khi có yêu cầu hợp pháp.
            </p>
          </div>
        </section>

        {/* User Rights */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">
            4. Quyền của người dùng
          </h2>

          <p className="text-gray-700 mb-4 leading-relaxed">
            Người dùng có quyền:
          </p>

          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              • Xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình trong phần
              "Tài khoản".
            </p>

            <p className="text-gray-700 leading-relaxed">
              • Thu hồi sự đồng ý xử lý dữ liệu. Khi thu hồi, một số dịch vụ có
              thể bị giới hạn hoặc không sử dụng được.
            </p>
          </div>
        </section>

        {/* Security and Sharing */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">
            5. Bảo mật và chia sẻ thông tin
          </h2>

          <p className="text-gray-700 mb-4 leading-relaxed">
            EcoRent áp dụng các biện pháp kỹ thuật để bảo vệ dữ liệu khỏi truy
            cập trái phép.
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            Thông tin chỉ được chia sẻ với:
          </p>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              • Cơ quan nhà nước có thẩm quyền khi có yêu cầu.
            </p>

            <p className="text-gray-700 leading-relaxed">
              • Đối tác liên quan đến việc vận hành dịch vụ (như trạm sạc, hệ
              thống thanh toán).
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            EcoRent không bán hoặc chia sẻ dữ liệu cá nhân cho bên thứ ba ngoài
            các mục đích trên.
          </p>
        </section>

        {/* Policy Updates */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">
            6. Cập nhật chính sách
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Chính sách có thể được điều chỉnh để phù hợp với quy định pháp luật.
            Người dùng sẽ được thông báo qua website hoặc email khi có thay đổi.
          </p>
        </section>

        {/* Footer Note */}
        <section className="border-t-2 border-black pt-8">
          <h3 className="text-xl font-bold text-black mb-4">
            Lưu ý quan trọng
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              Nếu bạn có bất kỳ thắc mắc nào về chính sách bảo mật dữ liệu cá
              nhân, vui lòng liên hệ với chúng tôi qua email hoặc hotline được
              cung cấp trên website <strong>EcoRent</strong>.
            </p>
            <p>
              Việc tiếp tục sử dụng dịch vụ sau khi chính sách được cập nhật
              đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default SecurityPolicies;
