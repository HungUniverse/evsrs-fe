import Hero from "./components/hero";
import WhyEcoRent from "./components/whyEco";
import Footer from "../components/layout/footer";
import HowToRentSteps from "./components/howToRent";
import AboutMioto from "./components/aboutMioto";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyEcoRent />
      <HowToRentSteps />
      <AboutMioto />
      <Footer />
    </>
  );
}
