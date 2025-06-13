import React from "react";
import { VscGithubInverted } from "react-icons/vsc";
import AnimatedButton from "./AnimatedButton";
import RevealY from "./RevealY";

const HeroContent = () => {
  return (
    <div className="relative h-full w-full pt-32 md:pt-48 lg:pt-64 px-4 sm:px-6 md:px-8 lg:px-10 z-40 pb-20">
      <div className="flex justify-between items-start gap-12 xl:gap-20">
        {/* Stack of tools */}
        <div className="hidden lg:flex gap-10 text-zinc-400 flex-shrink-0 font-neue-montreal font-medium pt-5">
          <div className="flex flex-col gap-1 text-sm xl:text-base">
            {["React", "Next", "Tailwind CSS", "Shadcn", "Daisy UI"].map(
              (tool, i) => (
                <RevealY key={tool} delay={i * 0.1}>
                  <div>{tool}</div>
                </RevealY>
              )
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm xl:text-base">
            {["Express", "Prisma", "Firebase", "and more ..."].map(
              (tool, i) => (
                <RevealY key={tool} delay={(i + 5) * 0.1}>
                  <div
                    className={tool === "and more ..." ? "text-[#ff8d74]" : ""}
                  >
                    {tool}
                  </div>
                </RevealY>
              )
            )}
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col w-full lg:max-w-none text-left">
          <RevealY delay={0}>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-medium text-white font-neue-montreal leading-tight">
              Stop copying boring boilerplates.
            </h1>
          </RevealY>

          <RevealY delay={0.2}>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-medium text-white font-neue-montreal leading-tight">
              Start{" "}
              <span className="bg-gradient-to-t from-[#ff4c24] to-[#ffe1d6] bg-clip-text text-transparent">
                forging
              </span>{" "}
              them.
            </h1>
          </RevealY>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mt-10">
            <RevealY delay={0.4}>
              <AnimatedButton className="bg-white px-6 py-3 text-black rounded w-full sm:w-auto">
                Get started
              </AnimatedButton>
            </RevealY>
            <RevealY delay={0.5}>
              <AnimatedButton className="bg-glass px-6 py-3 text-white rounded flex gap-3 items-center w-full sm:w-auto">
                <VscGithubInverted className="text-white" size={20} />
                Github
              </AnimatedButton>
            </RevealY>
          </div>

          {/* Paragraph */}
          <RevealY delay={0.6}>
            <p className="text-sm lg:text-md text-white mt-20 max-w-2xl font-neue-montreal font-medium">
              Anvil is a modular stack generator for modern web projects —
              create fully configured architectures with React, Next.js,
              Express, Prisma, Tailwind, Auth providers, and more. Every
              decision is framework-aware, dependency-validated, and file-merged
              — so you can start building, not wiring.
            </p>
          </RevealY>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
