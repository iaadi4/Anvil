"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

type Transform = {
  x: number;
  y: number;
  rotate: number;
};

type Piece = {
  id: string;
  logo: string;
  initial: Transform;
  final: Transform;
};

const pieces: Piece[] = [
  {
    id: "react",
    logo: "/react.png",
    initial: { x: 50, y: 50, rotate: -20 },
    final: { x: 50, y: 110, rotate: 0 },
  },
  {
    id: "tailwind",
    logo: "/tailwind.png",
    initial: { x: 250, y: 50, rotate: 30 },
    final: { x: 150, y: 112.5, rotate: 90 },
  },
  {
    id: "shadcn",
    logo: "/shadcn.png",
    initial: { x: -20, y: 230, rotate: -95 },
    final: { x: 50, y: 210, rotate: 90 },
  },
  {
    id: "express",
    logo: "/express.png",
    initial: { x: 180, y: 250, rotate: 25 },
    final: { x: 150, y: 207.5, rotate: 0 },
  },
  {
    id: "prisma",
    logo: "/prisma.png",
    initial: { x: 300, y: 150, rotate: 25 },
    final: { x: 250, y: 207.5, rotate: 270 },
  },
];

export default function PuzzlePieces() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pieceRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial positions
      pieceRefs.current.forEach((el, i) => {
        const { x, y, rotate } = pieces[i].initial;
        gsap.set(el, { x, y, rotate });
      });

      const handleEnter = () => {
        pieces.forEach((piece, i) => {
          gsap.to(pieceRefs.current[i], {
            x: piece.final.x,
            y: piece.final.y,
            rotate: piece.final.rotate,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      };

      const handleLeave = () => {
        pieces.forEach((piece, i) => {
          gsap.to(pieceRefs.current[i], {
            x: piece.initial.x,
            y: piece.initial.y,
            rotate: piece.initial.rotate,
            duration: 0.8,
            ease: "power3.inOut",
          });
        });
      };

      const container = containerRef.current;
      container?.addEventListener("mouseenter", handleEnter);
      container?.addEventListener("mouseleave", handleLeave);

      return () => {
        container?.removeEventListener("mouseenter", handleEnter);
        container?.removeEventListener("mouseleave", handleLeave);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[26rem] -mt-[8rem] overflow-visible flex items-center justify-center cursor-pointer relative z-0"
    >
      <div className="relative w-[400px] h-[400px]">
        {pieces.map((piece, i) => (
          <div
            key={piece.id}
            ref={(el) => {
              if (el) pieceRefs.current[i] = el;
            }}
            className="absolute w-[150px] h-[150px] pointer-events-none"
          >
            <Image
              src="/puzzle.png"
              alt="puzzle"
              width={150}
              height={150}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-[60px] opacity-90 scale-[1.8]"
                  style={{
                    backgroundColor: getGlowColor(piece.id),
                  }}
                />
                <Image
                  src={piece.logo}
                  alt={piece.id}
                  width={40}
                  height={40}
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
      return "#61dafb"; // React blue
    case "tailwind":
      return "#38bdf8"; // Tailwind cyan
    case "shadcn":
      return "#ffffff"; // white or soft gray
    case "express":
      return "#ffffff"; // gray
    case "prisma":
      return "#ffffff"; // dark teal
    default:
      return "#ffffff";
  }
}
