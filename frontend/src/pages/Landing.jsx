import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../sections/Hero";
import WhatWeDo from "../sections/WhatWeDo";
import Builds from "../sections/Builds";
import Services from "../sections/Services";
import Benefits from "../sections/Benefits";
import Process from "../sections/Process";
import LeadForm from "../sections/LeadForm";
import Contacts from "../sections/Contacts";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0E1116] text-white">
      <Header />
      <main>
        <Hero />
        <WhatWeDo />
        <Builds />
        <Services />
        <Benefits />
        <Process />
        <LeadForm />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
