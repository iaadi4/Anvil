import React from "react";
import PuzzlePieces from "./PuzzlePiece";
import MergeAnimation from "./MergeAnimation";
import AuthIconGlow from "./AuthGlowIcon";
import TerminalTyping from "./TerminalTyping";
import ReadmeManifestAnimation from "./ReadmeAnimation";
import RevealY from "./RevealY";

export default function BentoGrid() {
  return (
    <div className="min-h-screen bg-black py-10 md:py-16 lg:py-20 font-neue-montreal px-4 md:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
      <div className="w-full mx-auto flex flex-col items-center justify-center">
        <RevealY delay={0.2}>
          <h2 className="text-4xl overflow-hidden md:text-5xl lg:text-6xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl font-medium text-center text-white leading-tight">
            The{" "}
            <span className="bg-gradient-to-t from-[#ff4c24] to-[#ffe1d6] bg-clip-text text-transparent">
              tool
            </span>{" "}
            we wish we had,
          </h2>
        </RevealY>

        <RevealY delay={0.3}>
          <h2 className="text-4xl overflow-hidden md:text-5xl lg:text-6xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl font-medium text-center text-white leading-tight">
            so we built it for you
          </h2>
        </RevealY>

        {/* Stacked Layout - for small and medium screens */}
        <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto lg:hidden mt-8 mt:mb-12 lg:mt-20">
          {/* Modular Stack Building */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-end px-6 py-8 h-[25rem]">
            <div className="absolute inset-0 z-0">
              <PuzzlePieces />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6),_transparent_70%)] z-10 pointer-events-none" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-medium text-white mb-2">
                Modular Stack Building
              </h2>
              <p className="text-zinc-400 text-sm font-medium">
                Pick your stack components like it's a buffet. React? Next?
                Prisma? Express? Tailwind? Yes to all. Or just some.
              </p>
            </div>
          </div>

          {/* Intelligent File Merging */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-end px-6 py-8 h-[25rem]">
            <div className="absolute inset-0 z-0">
              <MergeAnimation />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4),_transparent_70%)] z-10 pointer-events-none" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-medium text-white mb-2">
                Intelligent File Merging
              </h2>
              <p className="text-zinc-400 text-sm font-medium">
                Auto-merge configs, route files, styles, even imports — without
                breaking your project or your soul. PostCSS for styles, ASTs for
                code, and zero conflicts. Ever.
              </p>
            </div>
          </div>

          {/* Auth Without Tears */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-end px-6 py-8 h-[25rem]">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <AuthIconGlow />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6),_transparent_70%)] z-10 pointer-events-none" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-medium text-white mb-2">
                Auth Without Tears
              </h2>
              <p className="text-zinc-400 text-sm font-medium">
                Choose from Clerk, NextAuth, or Firebase Auth — no 90-minute
                YouTube setup rituals required.
              </p>
            </div>
          </div>

          {/* The CLI We Always Wanted */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-end px-6 py-8 h-[25rem]">
            <div className="absolute inset-0 z-0 p-8">
              <TerminalTyping />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.5),_transparent_70%)] z-10 pointer-events-none" />
            </div>
            <div className="relative z-10 text-center mt-auto">
              <h2 className="text-2xl font-medium text-white mb-2">
                The CLI We Always Wanted
              </h2>
              <p className="text-zinc-400 text-sm font-medium">
                `npx create-anvil@latest` scaffolds your entire stack —
                frameworks, auth, database, styling — in one go. Fast, modular,
                effortless.
              </p>
            </div>
          </div>

          {/* Manifest Your README */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-end px-6 py-8 h-[25rem]">
            <div className="absolute inset-0 z-0 p-6">
              <ReadmeManifestAnimation />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4),_transparent_70%)] z-10 pointer-events-none" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-medium text-white mb-2">
                Manifest Your README
              </h2>
              <p className="text-zinc-400 text-sm font-medium">
                Describe your project stack — we'll materialize the perfect
                README for you.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Original 5x2 Grid */}
        <div className="hidden lg:grid grid-cols-5 grid-rows-2 gap-4 h-[50rem] xl:h-[60rem] w-full max-w-7xl mx-auto mt-8 md:mt-12 lg:mt-20">
          {/* Grid Item 1 - Top Left (Square) */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col col-span-2 row-span-1 justify-end px-6 py-10">
            <div className="absolute inset-0 z-0">
              <PuzzlePieces />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6),_transparent_70%)] z-10 pointer-events-none" />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-medium text-white mb-2">
                Modular Stack Building
              </h2>
              <p className="text-zinc-400 text-sm font-medium max-w-sm mx-auto">
                Pick your stack components like it's a buffet. React? Next?
                Prisma? Express? Tailwind? Yes to all. Or just some.
              </p>
            </div>
          </div>

          {/* Grid Item 2 - Top Right (Rectangular - spans 3 columns) */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col col-span-3 row-span-1 justify-end px-6 pt-6 pb-10">
            <div className="absolute inset-0 z-0">
              <MergeAnimation />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4),_transparent_70%)] z-10 pointer-events-none" />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-medium text-white mb-2">
                Intelligent File Merging
              </h2>
              <p className="text-zinc-400 text-sm font-medium max-w-lg mx-auto">
                Auto-merge configs, route files, styles, even imports — without
                breaking your project or your soul. PostCSS for styles, ASTs for
                code, and zero conflicts. Ever.
              </p>
            </div>
          </div>

          {/* Grid Item 3 - Bottom Left (Rectangular - spans 1 column) */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col col-span-1 row-span-1 justify-end px-6 py-10">
            {/* Glowing Icon Animation */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <AuthIconGlow />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6),_transparent_70%)] z-10 pointer-events-none" />
            </div>

            {/* Text Content */}
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-medium text-white mb-2">
                Auth Without Tears
              </h2>
              <p className="text-zinc-400 text-sm font-medium max-w-xs mx-auto">
                Choose from Clerk, NextAuth, or Firebase Auth — no 90-minute
                YouTube setup rituals required.
              </p>
            </div>
          </div>

          {/* Grid Item 4 - Bottom Right (spans 2 columns) */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col col-span-2 row-span-1 justify-end px-6 py-10">
            {/* Terminal typing animation */}
            <div className="absolute inset-0 z-0 p-10">
              <TerminalTyping />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.5),_transparent_70%)] z-10 pointer-events-none" />
            </div>

            <div className="relative z-10 text-center mt-auto">
              <h2 className="text-2xl font-medium text-white mb-2">
                The CLI We Always Wanted
              </h2>
              <p className="text-zinc-400 text-sm font-medium max-w-xs mx-auto">
                `npx create-anvil@latest` scaffolds your entire stack —
                frameworks, auth, database, styling — in one go. Fast, modular,
                effortless.
              </p>
            </div>
          </div>

          {/* Grid Item 5 - README Manifest (spans 2 columns) */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col col-span-2 row-span-1 justify-end px-6 py-10">
            {/* README Animation */}
            <div className="absolute inset-0 z-0 p-6">
              <ReadmeManifestAnimation />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4),_transparent_70%)] z-10 pointer-events-none" />
            </div>

            {/* Text Content */}
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-medium text-white mb-2">
                Manifest Your README
              </h2>
              <p className="text-zinc-400 text-sm font-medium max-w-xs mx-auto">
                Describe your project stack — we'll materialize the perfect
                README for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
