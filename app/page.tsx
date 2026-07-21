import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Benefits, FAQ, FeaturedClasses, FinalCTA, HowItWorks, Locations, StatsBand, Testimonials } from "@/components/landing/LandingSections";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* <StatsBand /> */}
        <Benefits />
        {/* <FeaturedClasses /> */}
        <HowItWorks />
        {/* <Locations /> */}
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
