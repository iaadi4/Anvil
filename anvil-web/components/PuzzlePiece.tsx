"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

// Fixed configuration for all screen sizes
const config = {
  containerSize: { width: 400, height: 400 },
  pieceSize: { width: 150, height: 150 },
  logoSize: { width: 40, height: 40 },
  pieces: [
    {
      id: "react",
      logo: "/icons/react.png",
      initial: { x: 50, y: -50, rotate: -20 },
      final: { x: 50, y: 10, rotate: 0 },
    },
    {
      id: "tailwind",
      logo: "/icons/tailwind.png",
      initial: { x: 250, y: -50, rotate: 30 },
      final: { x: 145, y: 12.5, rotate: 90 },
    },
    {
      id: "shadcn",
      logo: "/icons/shadcn.png",
      initial: { x: -20, y: 130, rotate: -95 },
      final: { x: 51, y: 105, rotate: 90 },
    },
    {
      id: "express",
      logo: "/icons/express.png",
      initial: { x: 180, y: 150, rotate: 25 },
      final: { x: 142, y: 104.5, rotate: 0 },
    },
    {
      id: "prisma",
      logo: "/icons/prisma.png",
      initial: { x: 300, y: 50, rotate: 25 },
      final: { x: 235, y: 107.5, rotate: 270 },
    },
  ],
};

export default function PuzzlePieces() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pieceRefs = useRef<HTMLDivElement[]>([]);
  const glowRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      let hasAnimated = false;

      // Set initial puzzle positions and hide glows
      pieceRefs.current.forEach((el, i) => {
        if (el && config.pieces[i]) {
          const { x, y, rotate } = config.pieces[i].initial;
          gsap.set(el, { x, y, rotate });
        }
      });

      glowRefs.current.forEach((el) => {
        if (el) {
          gsap.set(el, { opacity: 0 });
        }
      });

      const handleEnter = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        config.pieces.forEach((piece, i) => {
          const pieceEl = pieceRefs.current[i];
          if (pieceEl) {
            gsap.to(pieceEl, {
              x: piece.final.x,
              y: piece.final.y,
              rotate: piece.final.rotate,
              duration: 0.8,
              ease: "power3.out",
              onComplete: () => {
                const glowEl = glowRefs.current[i];
                if (glowEl) {
                  gsap.to(glowEl, {
                    opacity: 0.9,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              },
            });
          }
        });

        container?.removeEventListener("mouseenter", handleEnter);
      };

      const container = containerRef.current;
      container?.addEventListener("mouseenter", handleEnter);

      return () => {
        container?.removeEventListener("mouseenter", handleEnter);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-visible flex items-center justify-center cursor-pointer relative z-0"
    >
      <div
        className="relative"
        style={{
          width: config.containerSize.width,
          height: config.containerSize.height,
        }}
      >
        {config.pieces.map((piece, i) => (
          <div
            key={piece.id}
            ref={(el) => {
              if (el) pieceRefs.current[i] = el;
            }}
            className="absolute pointer-events-none"
            style={{
              width: config.pieceSize.width,
              height: config.pieceSize.height,
            }}
          >
            <Image
              src="/images/puzzle.png"
              alt="puzzle"
              width={config.pieceSize.width}
              height={config.pieceSize.height}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-[60px] opacity-0 scale-[1.8]"
                  style={{ backgroundColor: getGlowColor(piece.id) }}
                  ref={(el) => {
                    if (el) glowRefs.current[i] = el;
                  }}
                />
                <Image
                  src={piece.logo}
                  alt={piece.id}
                  width={config.logoSize.width}
                  height={config.logoSize.height}
                  className="relative object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getGlowColor(id: string) {
  switch (id) {
    case "react":
      return "#61dafb";
    case "tailwind":
      return "#38bdf8";
    case "shadcn":
    case "express":
    case "prisma":
    default:
      return "#ffffff";
  }
}
