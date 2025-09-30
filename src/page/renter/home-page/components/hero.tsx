import { Button } from "@/components/ui/button";
import car from "../../../../images/car.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
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

        <Button
          onClick={() => navigate("/search-car")}
          className="bg-green-500 hover:bg-green-700 text-white px-20 py-8 rounded-full shadow-lg text-3xl font-bold"
        >
          Thuê xe
        </Button>
      </div>
      <div className="absolute inset-0 bg-black/50" />
    </section>
  );
}
