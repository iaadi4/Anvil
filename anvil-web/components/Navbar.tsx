"use client";

import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import AnimatedText from "./AnimatedText";
import AnimatedButton from "./AnimatedButton";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import RevealY from "./RevealY";
import { VscGithubInverted } from "react-icons/vsc";

const dropdownVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0, transformOrigin: "top" },
  visible: {
    opacity: 1,
    scaleY: 1,
    transformOrigin: "top",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // cubic-bezier for buttery-smooth feel
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0,
    transformOrigin: "top",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarBg = isMobileMenuOpen
    ? "bg-black/90"
    : "bg-gradient-to-b from-black via-black/70 to-transparent";

  return (
    <div
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "px-8 py-2" : "px-10 py-4"
      } ${navbarBg}`}
    >
      <div className="flex justify-between items-center h-fit">
        <Logo />

        {/* Desktop Nav */}
        <RevealY>
          <nav className="hidden md:flex items-center gap-8 font-medium font-neue-montreal text-white">
            <AnimatedText>Home</AnimatedText>
            <AnimatedText>About</AnimatedText>
            <AnimatedText>Services</AnimatedText>
            <AnimatedText>Contact</AnimatedText>
          </nav>
        </RevealY>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* CTA Button (Desktop only) */}
        <RevealY>
          <AnimatedButton className="bg-white px-8 hidden md:flex md:gap-3 md:items-center py-3 text-black rounded w-full sm:w-auto font-medium">
            <VscGithubInverted className="text-black" size={20} />
            Github
          </AnimatedButton>
        </RevealY>
      </div>

      {/* Mobile Menu Dropdown (Framer Motion - Smooth scaleY) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-dropdown"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="md:hidden origin-top text-white flex flex-col items-center gap-6 pt-6 pb-10 px-6 bg-black/90 backdrop-blur-sm"
          >
            <AnimatedText>Home</AnimatedText>
            <AnimatedText>About</AnimatedText>
            <AnimatedText>Services</AnimatedText>
            <AnimatedText>Contact</AnimatedText>
            <AnimatedButton className="bg-white px-8 py-3 flex gap-3 items-center text-black rounded w-full sm:w-auto">
              <VscGithubInverted className="text-black" size={20} />
              Github
            </AnimatedButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
