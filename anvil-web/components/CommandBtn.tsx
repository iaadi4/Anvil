"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiCopy, FiCheck } from "react-icons/fi";

const CopyCommand = () => {
  const [copied, setCopied] = useState(false);
  const command = "npx create-anvil@latest";

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 10000);
    });
  };

  return (
    <div className="bg-glass text-white rounded px-4 py-3 w-full sm:w-auto flex items-center justify-between gap-4 font-mono text-sm border border-white/10">
      <span className="whitespace-nowrap">{command}</span>
      <button
        onClick={handleCopy}
        className="text-white/80 hover:text-white transition relative w-5 h-5 cursor-pointer"
        title="Copy to clipboard"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FiCheck className="text-green-400 w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FiCopy className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default CopyCommand;
