"use client";

import React, { useEffect, useState } from "react";
import RevealY from "./RevealY";
import Image from "next/image";
import { motion } from "motion/react";

const logos = [
  "/logos/angular.svg",
  "/logos/betterauth.png",
  "/logos/daisyui.svg",
  "/logos/docker.svg",
  "/logos/drizzle.png",
  "/logos/express.svg",
  "/logos/firebase.svg",
  "/logos/mongodb.svg",
  "/logos/mysql.svg",
  "/logos/next.svg",
  "/logos/nextauth.svg",
  "/logos/node.svg",
  "/logos/postgresql.svg",
  "/logos/prisma.svg",
  "/logos/react.svg",
  "/logos/shadcn.png",
  "/logos/sqlite.svg",
  "/logos/tailwind.svg",
  "/logos/vue.svg",
];

const glowColor: Record<string, string> = {
  angular: "#dd0031",
  betterauth: "#c1c1c1",
  daisyui: "#a78bfa",
  docker: "#0db7ed",
  drizzle: "#22c55e",
  express: "#999999",
  firebase: "#ffa000",
  mongodb: "#47a248",
  mysql: "#00758f",
  next: "#b1b1b1",
  nextauth: "#8b5cf6",
  node: "#8cc84b",
  postgresql: "#336791",
  prisma: "#0c344b",
  react: "#61dafb",
  shadcn: "#a1a1a1",
  sqlite: "#003b57",
  tailwind: "#38bdf8",
  vue: "#42b883",
};

const useScreenSize = () => {
  const [columns, setColumns] = useState(13);
  const [isLarge, setIsLarge] = useState(true);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(5);
        setIsLarge(false);
      } else if (width < 1024) {
        setColumns(8);
        setIsLarge(false);
      } else {
        setColumns(13);
        setIsLarge(true);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { columns, isLarge };
};

const LogosSection = () => {
  const { columns, isLarge } = useScreenSize();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  let layout: (string | null)[][] = [];

  if (isLarge) {
    const structure = [null, 7, 7, 5, null];
    let logoIndex = 0;

    layout = structure.map((count) => {
      if (count === null) {
        return Array.from({ length: columns }, () => null);
      }
      const rowLogos = logos.slice(logoIndex, logoIndex + count);
      logoIndex += count;
      const padding = Math.floor((columns - count) / 2);
      return Array.from({ length: columns }, (_, i) =>
        i >= padding && i < padding + count ? rowLogos[i - padding] : null
      );
    });
  } else {
    const logosPerRow = Math.min(columns - 2, logos.length);
    const logoRows = Math.ceil(logos.length / logosPerRow);
    layout.push(Array.from({ length: columns }, () => null));

    for (let i = 0; i < logoRows; i++) {
      const slice = logos.slice(i * logosPerRow, (i + 1) * logosPerRow);
      const padding = Math.floor((columns - slice.length) / 2);
      const row = Array.from({ length: columns }, (_, idx) =>
        idx >= padding && idx < padding + slice.length
          ? slice[idx - padding]
          : null
      );
      layout.push(row);
    }

    layout.push(Array.from({ length: columns }, () => null));
  }

  return (
    <div className="min-h-screen w-screen my-12 sm:my-16 lg:my-20 flex flex-col gap-10">
      <div className="w-full h-fit font-neue-montreal flex flex-col items-center text-4xl md:text-5xl lg:text-6xl font-medium text-center text-white leading-tight">
        <RevealY delay={0.2}>
          <h2 className="overflow-hidden">
            <span className="bg-gradient-to-t from-[#ff4c24] to-[#ffe1d6] bg-clip-text text-transparent">
              Everything
            </span>{" "}
            you need.
          </h2>
        </RevealY>
        <RevealY delay={0.3}>
          <h2 className="overflow-hidden">Nothing you don't.</h2>
        </RevealY>
      </div>

      <div className="relative w-full bg-black my-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70 pointer-events-none z-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70 pointer-events-none z-40" />

        <div className="relative z-20 flex flex-col gap-2 px-4">
          {layout.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                transform:
                  rowIndex % 2 === 0
                    ? isLarge
                      ? "translateX(3%)"
                      : "translateX(8%)"
                    : "none",
              }}
            >
              {row.map((src, cellIndex) => {
                const key = `${rowIndex}-${cellIndex}`;
                const glowKey = src?.split("/").pop()?.split(".")[0] || "";
                const color = glowColor[glowKey] ?? "#fff";

                if (!src) {
                  return (
                    <div
                      key={key}
                      className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg"
                    />
                  );
                }

                return (
                  <motion.div
                    key={key}
                    className="aspect-square cursor-pointer bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center"
                    animate={
                      hoveredKey === key
                        ? {
                            boxShadow: `0 0 50px 15px ${color}`,
                            transition: { duration: 0.4, ease: "easeOut" },
                          }
                        : {
                            boxShadow: "none",
                            transition: { duration: 0.5, ease: "easeIn" },
                          }
                    }
                    onMouseEnter={() => {
                      setHoveredKey(key);
                      setTimeout(() => {
                        setHoveredKey(null);
                      }, 3000);
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Logo ${cellIndex}`}
                      width={40}
                      height={40}
                      className="object-contain max-w-[60%] max-h-[60%] opacity-90 transition-all duration-300"
                      style={{
                        filter:
                          hoveredKey === key
                            ? `drop-shadow(0 0 14px ${color})`
                            : `drop-shadow(0 0 2px ${color})`,
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogosSection;
