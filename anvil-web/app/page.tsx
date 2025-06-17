import Background from "@/components/Background";
import HeroContent from "@/components/HeroContent";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import React, { Suspense } from "react";
import Loading from "./loading";
import BentoGrid from "@/components/BentoGrid";
import LogosSection from "@/components/LogosSection";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="relative h-fit w-dvw overflow-hidden bg-black">
        <Suspense fallback={<Loading />}>
        <Background />
        </Suspense>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/10 to-black/80 pointer-events-none" />
        <HeroContent />
      </div>
      <BentoGrid />
      <LogosSection />
    </>
  );
};

export default Home;
