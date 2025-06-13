"use client";

import { motion } from "motion/react";
import React from "react";

interface RevealYProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const RevealY: React.FC<RevealYProps> = ({ children, delay = 0, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "130%" }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RevealY;