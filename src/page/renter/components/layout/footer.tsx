export default function Footer() {
  return (
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
      <div className="max-w-6xl mx-auto px-4">
        <hr className="border-white/10" />
      </div>
      {/* Bottom */}
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
            <span className="text-slate-400">Nơi cấp:</span> Sở Kế hoạch và Đầu
            tư TPHCM
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <span className="text-slate-400">Địa chỉ:</span> 7 Đ. D1, Long Thạnh
            Mỹ, Thủ Đức, Hồ Chí Minh 700000, Việt Nam
          </p>
          <p>
            <span className="text-slate-400">Email:</span> support@ecorent.vn
          </p>
          <p>
            <span className="text-slate-400">Số điện thoại:</span> 0900 000 000
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
  );
}
