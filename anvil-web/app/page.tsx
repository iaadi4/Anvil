import Background from "@/components/Background";
import HeroContent from "@/components/HeroContent";
import Navbar from "@/components/Navbar";
import React, { Suspense } from "react";
import Loading from "./loading";
import BentoGrid from "@/components/BentoGrid";
import LogosSection from "@/components/LogosSection";
import GitHubSection from "@/components/GithubSection";
import Footer from "@/components/Footer";

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
      <GitHubSection />
      <Footer />
    </>
  );
};

export default Home;
