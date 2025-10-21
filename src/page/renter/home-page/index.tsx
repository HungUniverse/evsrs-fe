import Hero from "./components/hero";
import WhyEcoRent from "./components/whyEco";
import Footer from "../components/layout/footer";
import HowToRentSteps from "./components/howToRent";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyEcoRent />
      <HowToRentSteps />
      <Footer />
    </>
  );
}
