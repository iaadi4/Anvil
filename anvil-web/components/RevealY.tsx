"use client";

import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

interface RevealYProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const RevealY: React.FC<RevealYProps> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "130%" }}
        animate={isInView ? { y: 0 } : { y: "130%" }}
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
