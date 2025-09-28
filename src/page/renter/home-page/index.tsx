import Header from "../components/layout/header";
import Hero from "../components/layout/hero";
import WhyEcoRent from "../components/layout/whyEco";
import SelfDriveSection from "../components/layout/selfDrive";
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
