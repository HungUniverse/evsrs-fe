import { Button } from "@/components/ui/button";
import car from "../../../../images/car2.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-[650px] md:h-[100svh] overflow-hidden bg-white">
      <div
        className="hero-bg"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ ["--hero-image" as any]: `url(${car})` }} // truyền ảnh vào CSS var
      />

      {/* Content */}
      <div
        className="relative z-10 h-full max-w-[1200px] mx-auto px-6
                      flex flex-col items-center justify-center text-center"
      >
        <h1
          className="text-3xl md:text-7xl font-black mb-4 text-gradient opacity-0 animate-fade-in"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          Thuê xe điện dễ dàng, tiện lợi <br className="hidden sm:block" />
          tại trạm gần bạn
        </h1>

        <p
          className="text-xl md:text-2xl text-white/90 opacity-0 animate-fade-in max-w-3xl"
          style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
        >
          Trải nghiệm di chuyển xanh – tiết kiệm và bền vững cùng{" "}
          <span className="text-emerald-400 font-semibold underline decoration-2 underline-offset-4">
            EcoRent
          </span>
          .
        </p>

        <div
          className="mt-10 animate-fade-in opacity-0"
          style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
        >
          <Button
            onClick={() => navigate("/search-car")}
            className="btn-glow inline-flex items-center justify-center
             min-w-[260px] min-h-[72px]
             px-8 md:px-20 py-5 md:py-7
             text-2xl md:text-3xl leading-none tracking-wide
             font-extrabold rounded-full
             bg-emerald-600 hover:bg-emerald-700 text-white
             shadow-[0_12px_28px_rgba(16,185,129,.35)]
             hover:shadow-[0_16px_40px_rgba(16,185,129,.45)]
             transition-transform duration-300 hover:scale-[1.05]"
          >
            Thuê xe
          </Button>
        </div>
      </div>
    </section>
  );
}
