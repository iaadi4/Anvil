"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const rawReadme = `# My Awesome Project

## Tech Stack
- React 18 with TypeScript
- Next.js 14 App Router

## Styling
- Tailwind CSS
- Headless UI

## Database
- Prisma ORM
- PostgreSQL

## Backend
- Node.js
- Express.js

## Installation
\`\`\`bash
git clone https://github.com/username/projectname.git
cd my-awesome-project
npm install
\`\`\`

## Usage
\`\`\`bash
npm run dev
\`\`\`
`;

// Condensed version for mobile
const mobileReadme = `
# My Project

## Stack
- React + TypeScript
- Next.js 14

## Styling
- Tailwind CSS

## Database
- Prisma + PostgreSQL

## Backend
- Node.js + Express

## Install
\`\`\`bash
git clone repo
npm install
npm run dev
\`\`\`
`;

export default function ReadmeManifestAnimation() {
  const [typedContent, setTypedContent] = useState("");
  const [hovered, setHovered] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!hovered || typedContent.length > 0) return;

    const content = isMobile ? mobileReadme : rawReadme;
    let index = 0;
    const interval = setInterval(() => {
      if (index >= content.length) {
        clearInterval(interval);
        setIsTypingDone(true);
        return;
      }

      setTypedContent((prev) => prev + content[index]);
      index++;
    }, isMobile ? 20 : 15); // Slightly slower on mobile

    return () => clearInterval(interval);
  }, [hovered, isMobile]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [typedContent]);

  let lines = typedContent.split("\n");
  lines.pop();

  return (
    <div className="w-full h-full flex justify-center">
      <motion.div
        onMouseEnter={() => setHovered(true)}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full pb-3 sm:pb-5 
          h-60 sm:h-80 md:h-[17rem] lg:h-[16rem] xl:h-[18rem] 
          z-20 bg-[#1A1A1C] text-gray-100 rounded-lg border border-[#30363d] overflow-hidden 
          shadow-lg sm:shadow-xl"
      >
        {/* Top bar */}
        <div className="flex justify-between items-center 
          px-2 sm:px-4 pt-2 sm:pt-3 pb-1 sm:pb-2 
          border-b border-[#21262d]">
          <div className="flex space-x-1 sm:space-x-2">
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
          </div>
          {isTypingDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] sm:text-xs bg-green-600 text-white 
                px-1.5 sm:px-2 py-0.5 rounded"
            >
              ✓ Saved
            </motion.div>
          )}
        </div>

        {/* Scrollable code container */}
        <div
          ref={containerRef}
          className="px-2 sm:px-5 py-2 sm:py-4 h-full overflow-y-auto scroll-smooth 
            font-mono text-[10px] xs:text-[11px] sm:text-sm 
            leading-4 sm:leading-6"
        >
          {!hovered ? (
            <div className="flex items-center h-full justify-center 
              text-xs sm:text-sm text-gray-400">
              <span className="relative font-mono 
                text-[10px] xs:text-xs sm:text-xs text-gray-300 animate-pulse">
                <span className="inline sm:hidden">Generating README...</span>
                <span className="hidden sm:inline">Generating README.md</span>
                <span className="animate-blink ml-1 hidden sm:inline">...</span>
              </span>
            </div>
          ) : (
            <div className="flex w-full font-mono 
              text-[9px] xs:text-[10px] sm:text-xs 
              text-gray-300 bg-transparent">
              {/* Line numbers */}
              <div className="pr-2 sm:pr-4 text-right select-none text-gray-500 
                min-w-[1rem] sm:min-w-[1.5rem]">
                {lines.map((_, i) => (
                  <div
                    key={`line-${i}`}
                    className="h-4 sm:h-[1.5rem] leading-4 sm:leading-[1.5rem] 
                      text-[8px] xs:text-[9px] sm:text-xs"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code lines */}
              <div className="flex-1 overflow-x-auto">
                {lines.map((line, i) => (
                  <motion.div
                    key={`content-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: i * 0.01 }}
                    className="h-4 sm:h-[1.5rem] leading-4 sm:leading-[1.5rem] 
                      whitespace-pre-wrap break-words sm:break-all
                      text-[9px] xs:text-[10px] sm:text-xs"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Glow border */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-white/5 rounded-lg 
          shadow-[0_0_40px_5px_rgba(255,255,255,0.02)] sm:shadow-[0_0_80px_10px_rgba(255,255,255,0.03)]" />
      </motion.div>
    </div>
  );
}