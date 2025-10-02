import Hero from "./components/hero";
import WhyEcoRent from "./components/whyEco";
import SelfDriveSection from "./components/selfDrive";
import Footer from "../components/layout/footer";
import HeaderLite from "@/components/headerLite";

export default function HomePage() {
  return (
    <>
      <HeaderLite />
      <Hero />
      <WhyEcoRent />
      <SelfDriveSection />
      <Footer />
    </>
  );
}
