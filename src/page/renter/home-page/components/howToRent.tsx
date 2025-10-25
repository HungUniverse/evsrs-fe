import ChothueGiaRe from "@/images/ChoThueGiaRe.png";
import DanhGia from "@/images/DanhGia.png";
import DatXe from "@/images/DatXe.png";
import Laixe from "@/images/LaiXe.png";
type Step = {
  id: number;
  img: string;
  title1: string;
  title2?: string;
};

const steps: Step[] = [
  {
    id: 1,
    img: ChothueGiaRe,
    title1: "Đặt xe trên",
    title2: "app/web EcoRent",
  },
  {
    id: 2,
    img: DatXe,
    title1: "Nhận xe",
  },
  {
    id: 3,
    img: Laixe,
    title1: "Bắt đầu",
    title2: "hành trình",
  },
  {
    id: 4,
    img: DanhGia,
    title1: "Trả xe & kết thúc",
    title2: "chuyến đi",
  },
];

export default function HowToRentSteps() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-3">
          Hướng Dẫn Thuê Xe
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Chỉ với 4 bước đơn giản để trải nghiệm thuê xe EcoRent một cách nhanh
          chóng
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="relative">
                <img
                  src={s.img}
                  className="w-48 h-48 object-contain rounded-2xl shadow-md hover:scale-105 transition-transform rotate-90"
                  loading="lazy"
                />
                <span className="absolute -left-3 -top-3 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                  {String(s.id).padStart(2, "0")}
                </span>
              </div>

              <div className="text-xl font-semibold leading-tight">
                {s.title1}
                {s.title2 && (
                  <>
                    <br />
                    {s.title2}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
