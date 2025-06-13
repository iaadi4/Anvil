"use client";

import { cn } from "@/lib/utils";
import { motion, Variants, Transition } from "motion/react";
import { useState, ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = "",
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const letterAnimation: Variants = {
    rest: { y: 0 },
    hover: { y: -20 },
  };

  const letterAnimationBottom: Variants = {
    rest: { y: 20 },
    hover: { y: 0 },
  };

  const letterTransition: Transition = {
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94],
  };

  // Separate elements from text node
  const processedChildren = Array.isArray(children) ? children : [children];

  const textChildIndex = processedChildren.findIndex(
    (child) => typeof child === "string"
  );

  const text =
    textChildIndex !== -1
      ? (processedChildren[textChildIndex] as string)
      : null;

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center px-6 py-3 cursor-pointer",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={isHovered ? "hover" : "rest"}
      whileHover={{ scale: 0.95 }}
    >
      {processedChildren.map((child, i) => {
        if (typeof child === "string") {
          // Animate this text node
          return (
            <span
              key={`animated-text-${i}`}
              className="relative block overflow-hidden leading-none"
            >
              {/* Top layer */}
              <div className="flex space-x-[0.5px]">
                {child.split("").map((letter, j) => (
                  <motion.span
                    key={`top-${j}`}
                    variants={letterAnimation}
                    transition={{
                      ...letterTransition,
                      delay: j * 0.015,
                    }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>

              {/* Bottom layer */}
              <div className="absolute top-0 left-0 w-full h-full flex space-x-[0.5px] pointer-events-none">
                {child.split("").map((letter, j) => (
                  <motion.span
                    key={`bottom-${j}`}
                    variants={letterAnimationBottom}
                    transition={{
                      ...letterTransition,
                      delay: j * 0.015,
                    }}
                    className="inline-block"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>
            </span>
          );
        }

        // Non-text node (e.g., icon)
        return <span key={`element-${i}`}>{child}</span>;
      })}
    </motion.button>
  );
};

export default AnimatedButton;
