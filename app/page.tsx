import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/About";
import ClosingCTA from "@/components/sections/ClosingCTA";
import Differentiation from "@/components/sections/Differentiation";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Pillars from "@/components/sections/Pillars";
import Problem from "@/components/sections/Problem";
import Research from "@/components/sections/Research";
import Vision from "@/components/sections/Vision";
import WhatWeTest from "@/components/sections/WhatWeTest";
import WhyNow from "@/components/sections/WhyNow";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <Problem />
        <HowItWorks />
        <WhatWeTest />
        <WhyNow />
        <Pillars />
        <Research />
        <Differentiation />
        <Vision />
        <About />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
