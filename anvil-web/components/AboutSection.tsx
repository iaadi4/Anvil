"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import RevealY from "./RevealY";

const About = () => {
  return (
    <section className="bg-black text-white w-full px-6 py-24 font-neue-montreal relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl sm:text-6xl font-medium flex flex-col mb-10">
            <RevealY delay={0.1}>
              <div>Skip the setup.</div>
            </RevealY>
            <RevealY delay={0.2}>
              <div className="bg-gradient-to-t from-[#ff4c24] to-[#ffe1d6] bg-clip-text text-transparent">
                Start building.
              </div>
            </RevealY>
          </h2>

          <p className="text-white text-md font-medium">
            Anvil is a modern CLI tool that helps you launch full-stack web apps
            with ease. Choose your preferred frontend, backend, database,
            styling, and authentication tools—Anvil instantly generates a clean,
            organized project structure with everything wired up and ready to
            go. <br />
            <br />
            No more wasting hours on setup or wrestling with configs. With
            Anvil, you're ready to start building from the very first command.
          </p>
        </motion.div>

        {/* Image or CLI Screenshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl"
        >
          <Image
            src="/images/cli-preview.png" // replace with actual path
            alt="Anvil CLI in action"
            width={1000}
            height={600}
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
