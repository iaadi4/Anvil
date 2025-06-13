'use client';

import { motion, Variants, Transition } from "motion/react";
import { useState } from "react";

interface AnimatedTextProps {
  children: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const letterAnimation: Variants = {
    rest: { y: 0 },
    hover: { y: -25 }
  };

  const letterAnimationBottom: Variants = {
    rest: { y: 25 },
    hover: { y: 0 }
  };

  const underlineAnimation: Variants = {
    rest: { width: 0 },
    hover: { width: "100%" }
  };

  const letterTransition: Transition = {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94]
  };

  const underlineTransition: Transition = {
    duration: 0.7,
    ease: [0.25, 0.46, 0.45, 0.94]
  };

  const handleMouseEnter = (): void => setIsHovered(true);
  const handleMouseLeave = (): void => setIsHovered(false);

  return (
    <motion.div
      className="relative overflow-hidden block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={isHovered ? "hover" : "rest"}
    >
      <div className="relative">
        {/* Original text moving up */}
        <div className="flex">
          {children.split("").map((letter: string, i: number) => (
            <motion.span
              key={`top-${i}`}
              variants={letterAnimation}
              transition={{
                ...letterTransition,
                delay: i * 0.015
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
        
        {/* Duplicate text coming from below */}
        <div className="absolute top-0 left-0 flex">
          {children.split("").map((letter: string, i: number) => (
            <motion.span
              key={`bottom-${i}`}
              variants={letterAnimationBottom}
              transition={{
                ...letterTransition,
                delay: i * 0.015
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
        
        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-white"
          variants={underlineAnimation}
          transition={underlineTransition}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedText;