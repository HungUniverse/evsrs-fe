import Header from "../components/layout/header";
import Hero from "./components/hero";
import WhyEcoRent from "./components/whyEco";
import SelfDriveSection from "./components/selfDrive";
import Footer from "../components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <WhyEcoRent />
      <SelfDriveSection />
      <Footer />
    </>
  );
}
