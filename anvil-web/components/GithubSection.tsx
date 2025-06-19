"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VscGithubInverted } from "react-icons/vsc";
import { AiFillStar } from "react-icons/ai";
import AnimatedButton from "./AnimatedButton";
import RevealY from "./RevealY";

const GITHUB_REPO = "iaadi4/Anvil";

const GitHubSection = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
      .catch(console.error);
  }, []);

  return (
    <section className="w-full bg-black pb-24 px-6 text-center font-neue-montreal text-white flex flex-col items-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="relative mb-10"
      >
        <motion.div
          className="text-5xl"
          style={{
            color: "#FF4C24",
            textShadow:
              "0 0 12px rgba(255, 76, 36, 0.6), 0 0 24px rgba(255, 76, 36, 0.3)",
          }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🧡
        </motion.div>
      </motion.div>

      <RevealY delay={0.2}>
        <h2 className="text-3xl sm:text-4xl overflow-hidden font-medium ">
          Free & <span className="bg-gradient-to-t from-[#ff4c24] to-[#ffe1d6] bg-clip-text text-transparent">Open Source</span>
        </h2>
      </RevealY>

      <RevealY delay={0.3}>
        <p className="text-zinc-500 overflow-hidden text-md font-medium max-w-xl">
          Anvil is MIT licensed and always will be free and open source.
          <br />
          Built with love and community support.
        </p>
      </RevealY>

      <a
        href={`https://github.com/${GITHUB_REPO}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RevealY delay={0.4}>
          <AnimatedButton className="bg-white px-6 py-3 text-black rounded-lg flex gap-4 items-center w-full sm:w-auto mt-10">
            <VscGithubInverted className="text-black" size={20} />
            GitHub
            {stars !== null && (
              <motion.span
                className="flex items-center gap-1 px-3 py-1 border border-black/80 rounded-lg text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <AiFillStar className="text-[#FF4C24]" size={14} />
                {stars.toLocaleString()}
              </motion.span>
            )}
          </AnimatedButton>
        </RevealY>
      </a>
    </section>
  );
};

export default GitHubSection;
