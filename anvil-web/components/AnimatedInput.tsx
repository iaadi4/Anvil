'use client';

import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

const AnimatedInput = ({ placeholder, type }: { placeholder: string; type: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <div ref={ref} className="relative flex-1 min-w-[120px] overflow-hidden">
      {/* Bottom border animation */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 h-[1.5px] bg-white"
      />
      
      {/* Input field fade-in */}
      <motion.input
        type={type}
        placeholder={placeholder}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        className="bg-transparent border-none text-sm text-white placeholder-zinc-500 focus:outline-none px-2 py-1 w-full"
      />
    </div>
  );
};

export default AnimatedInput;