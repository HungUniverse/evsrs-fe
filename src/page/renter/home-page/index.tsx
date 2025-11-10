import { useEffect } from "react";
import Hero from "./components/hero";
import WhyEcoRent from "./components/whyEco";
import Footer from "../components/layout/footer";
import HowToRentSteps from "./components/howToRent";
import AboutMioto from "./components/aboutMioto";
import { useSystemConfig } from "@/hooks/use-system-config";

export default function HomePage() {
  const { fetchAndSave } = useSystemConfig("Deposit");

  useEffect(() => {
    fetchAndSave();
  }, [fetchAndSave]);

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
