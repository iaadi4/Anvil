"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const glowColor = "#FF4C24";

// Helper to detect screen size
const useScreenSize = () => {
  const [size, setSize] = useState<"sm" | "md" | "lg">("lg");

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) setSize("sm");
      else if (width < 1024) setSize("md");
      else setSize("lg");
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};

const AuthIconGlow = () => {
  const [hovered, setHovered] = useState(false);
  const screenSize = useScreenSize();

  // Define curves based on screen size
  const curves = (() => {
    switch (screenSize) {
      case "sm":
        return [
          "M0,40 C50,40 250,40 300,40",
          "M0,60 C50,50 250,50 300,60",
          "M0,80 C50,60 250,60 300,80",
          "M0,100 C50,70 250,70 300,100",
        ];
      case "md":
        return [
          "M0,60 C50,60 250,60 300,60",
          "M0,80 C50,70 250,70 300,80",
          "M0,100 C50,80 250,80 300,100",
          "M0,120 C50,90 250,90 300,120",
        ];
      default:
        return [
          "M0,10 C50,10 250,10 300,10",
          "M0,50 C50,30 250,30 300,50",
          "M0,90 C50,50 250,50 300,90",
          "M0,130 C50,60 250,60 300,130",
        ];
    }
  })();

  // Pulse size
  const pulseSize = {
    sm: { rx: 4, ry: 1.5 },
    md: { rx: 3.5, ry: 1.2 },
    lg: { rx: 5, ry: 2 },
  }[screenSize];

  return (
    <div
      className="relative w-full h-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* SVG Curves */}
      <svg
        className="absolute w-full h-full z-0"
        viewBox="0 0 300 200"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {curves.map((d, i) => (
          <path
            key={`base-${i}`}
            id={`path-${i}`}
            d={d}
            stroke="#666"
            strokeWidth="1"
            opacity="0.25"
          />
        ))}
        {/* Animated Pulses */}
        {hovered &&
          curves.map((_, i) => (
            <React.Fragment key={`pulse-${i}`}>
              {/* Right pulse */}
              <motion.ellipse
                rx={pulseSize.rx}
                ry={pulseSize.ry}
                fill={glowColor}
              >
                <animateMotion
                  dur={`${1 + i * 0.3}s`}
                  repeatCount="indefinite"
                  keyPoints="0.5;1"
                  keyTimes="0;1"
                >
                  <mpath href={`#path-${i}`} />
                </animateMotion>
              </motion.ellipse>
              {/* Left pulse */}
              <motion.ellipse
                rx={pulseSize.rx}
                ry={pulseSize.ry}
                fill={glowColor}
              >
                <animateMotion
                  dur={`${1 + i * 0.3}s`}
                  repeatCount="indefinite"
                  keyPoints="0.5;0"
                  keyTimes="0;1"
                >
                  <mpath href={`#path-${i}`} />
                </animateMotion>
              </motion.ellipse>
            </React.Fragment>
          ))}
      </svg>

      {/* Glow circle */}
      {hovered && (
        <motion.div
          className="absolute top-[30%] left-[25%] sm:left-[37%] sm:top-[18%] rounded-full bg-[#FF4C24] opacity-40 blur-2xl"
          style={{
            width:
              screenSize === "sm"
                ? "9rem"
                : screenSize === "md"
                ? "10rem"
                : "11rem",
            height:
              screenSize === "sm"
                ? "9rem"
                : screenSize === "md"
                ? "10rem"
                : "11rem",
          }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Central icon */}
      <motion.div
        className="absolute top-2/5 left-1/2 z-10"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{
          filter: hovered
            ? "drop-shadow(0 0 8px #FF4C24) drop-shadow(0 0 16px #FF4C24)"
            : "none",
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/images/lock.png"
          alt="Auth icon"
          height={48}
          width={48}
          className="object-contain w-20 h-20 lg:w-18 lg:h-18 xl:w-20 xl:h-20"
        />
      </motion.div>
    </div>
  );
};

export default AuthIconGlow;
