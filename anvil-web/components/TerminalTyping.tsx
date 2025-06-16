"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type RegularLine = {
  type: "text";
  content: string | string[];
  color?: string;
  delay: number;
};

type LoadingLine = {
  type: "loading";
  text: string;
  delay: number;
};

type InstalledLine = {
  type: "installed";
  text: string;
  color?: string;
  delay: number;
};

type Line = RegularLine | LoadingLine | InstalledLine;

const baseLines: Line[] = [
  {
    type: "text",
    content: "✔ Create your own Full Stack boilerplate",
    color: "text-blue-500",
    delay: 800,
  },
  {
    type: "text",
    content: "[INPUT] Please enter a name for your project directory.",
    delay: 1000,
  },
  {
    type: "text",
    content: ["|", "my-app"],
    color: "text-zinc-400",
    delay: 400,
  },
  { type: "text", content: "[INPUT] Select a framework:", delay: 1000 },
  {
    type: "text",
    content: ["|", "React with TypeScript"],
    color: "text-zinc-400",
    delay: 600,
  },
  { type: "text", content: "[INPUT] Include Tailwind CSS?", delay: 400 },
  { type: "text", content: ["|", "Yes"], color: "text-zinc-400", delay: 300 },
  { type: "text", content: "[INPUT] Choose a styling library:", delay: 400 },
  {
    type: "text",
    content: ["|", "Shadcn UI"],
    color: "text-zinc-400",
    delay: 300,
  },
  {
    type: "text",
    content: "[INPUT] Include backend support (Express)?",
    delay: 400,
  },
  { type: "text", content: ["|", "Yes"], color: "text-zinc-400", delay: 300 },
  { type: "text", content: "[INPUT] Select an ORM:", delay: 400 },
  {
    type: "text",
    content: ["|", "Prisma"],
    color: "text-zinc-400",
    delay: 300,
  },
  {
    type: "text",
    content: "[INPUT] Choose a database for Prisma:",
    delay: 400,
  },
  { type: "text", content: ["|", "MySQL"], color: "text-zinc-400", delay: 300 },
  { type: "text", content: "[INPUT] Select an auth service:", delay: 400 },
  { type: "text", content: ["|", "Clerk"], color: "text-zinc-400", delay: 300 },
  { type: "text", content: "[INPUT] Select additional tools:", delay: 400 },
  { type: "text", content: ["|", "None"], color: "text-zinc-400", delay: 300 },
  { type: "loading", text: "Installing dependencies", delay: 1000 },
  {
    type: "installed",
    text: "✔ Successfully installed dependencies",
    color: "text-green-400",
    delay: 1000,
  },
  {
    type: "text",
    content: "✔ Project created successfully at ./my-app",
    color: "text-green-400 font-semibold",
    delay: 1000,
  },
];

export default function TerminalTyping() {
  const [renderedLines, setRenderedLines] = useState<Line[]>([
    {
      type: "text",
      content: "$ npx create-anvil@latest",
      color: "text-white",
      delay: 0,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [loadingDotCount, setLoadingDotCount] = useState(1);
  const [dotsActive, setDotsActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [renderedLines]);

  // Animate loading dots
  useEffect(() => {
    if (!dotsActive) return;
    const interval = setInterval(() => {
      setLoadingDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [dotsActive]);

  // Animate line rendering
  useEffect(() => {
    if (!hovered || currentIndex >= baseLines.length) return;

    const line = baseLines[currentIndex];

    const timeout = setTimeout(() => {
      setRenderedLines((prev) => [...prev, line]);
      setCurrentIndex((prev) => prev + 1);

      if (line.type === "installed") {
        setDotsActive(false); // Stop dot animation
      }
    }, line.delay);

    return () => clearTimeout(timeout);
  }, [hovered, currentIndex]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      className="font-mono 
        text-[10px] xs:text-[11px] sm:text-xs xl:text-sm 
        bg-[#1A1A1C] border border-zinc-700 cursor-pointer shadow-2xl rounded-xl 
        p-3 sm:p-4 md:p-5 lg:p-4 xl:p-6 
        w-full 
        h-48 xs:h-56 sm:h-64 md:h-60 lg:h-64 xl:h-[17rem] 
        z-20 overflow-y-auto 
        space-y-0.5 sm:space-y-1 
        relative
        leading-tight sm:leading-normal"
    >
      {renderedLines.map((line, idx) => {
        if (line.type === "loading") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-yellow-400 break-words"
            >
              <span className="inline sm:hidden">Installing deps</span>
              <span className="hidden sm:inline">{line.text}</span>
              {dotsActive ? ".".repeat(loadingDotCount) : ""}
            </motion.div>
          );
        }

        if (line.type === "installed") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${line.color ?? "text-white"} break-words`}
            >
              <span className="inline sm:hidden">✔ Deps installed</span>
              <span className="hidden sm:inline">{line.text}</span>
            </motion.div>
          );
        }

        const color = line.color ?? "text-white";
        const content = line.content;

        if (Array.isArray(content)) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex gap-1 sm:gap-2 ${color} break-words`}
            >
              <span className="flex-shrink-0">{content[0]}</span>
              <span className="break-words">{content[1]}</span>
            </motion.div>
          );
        }

        // For string content, handle [INPUT] with responsive text
        if (typeof content === "string" && content.startsWith("[INPUT]")) {
          const green = "[INPUT]";
          const rest = content.replace("[INPUT]", "").trimStart();

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-1 sm:gap-2 break-words"
            >
              <span className="text-green-500 flex-shrink-0">{green}</span>
              <span className="text-white break-words">
                {/* Truncate long text on mobile */}
                <span className="inline sm:hidden">
                  {rest.length > 20 ? rest.substring(0, 20) + "..." : rest}
                </span>
                <span className="hidden sm:inline">{rest}</span>
              </span>
            </motion.div>
          );
        }

        // Handle success messages responsively
        if (
          typeof content === "string" &&
          content.includes("Project created successfully")
        ) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${color} flex items-center gap-1 sm:gap-2 break-words`}
            >
              <span className="inline sm:hidden">✔ Project created!</span>
              <span className="hidden sm:inline">{content}</span>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${color} flex items-center gap-1 sm:gap-2 break-words`}
          >
            {idx === 0 && !hovered ? (
              <>
                <span className="break-all">
                  <span className="inline sm:hidden">$ npx create-anvil</span>
                  <span className="hidden sm:inline">{content}</span>
                </span>
                <motion.span
                  className="text-zinc-500 text-sm sm:text-md flex-shrink-0"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span className="text-orange-500">█</span>
                </motion.span>
              </>
            ) : (
              <span className="break-words">{content}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
