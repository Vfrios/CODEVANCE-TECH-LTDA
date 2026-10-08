import React from "react";
import useScrollAnimations from "@/hooks/useScrollAnimations";
import {
  ScrollProgress,
  Hero,
  Problems,
  Solutions,
  SectionDivider,
  HowItWorks,
  Pricing,
  About,
  Contact,
} from "@/features/home";
import { Navbar, Footer, WhatsAppFloat } from "@/features/layout";

export default function Home() {
  useScrollAnimations();

  return (
    <div className="min-h-screen bg-obsidian overflow-x-clip">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <SectionDivider />
        <Solutions />
        <HowItWorks />
        <SectionDivider />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
