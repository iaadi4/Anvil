"use client";

import React, { useRef } from "react";
import { BsInstagram, BsLinkedin, BsTwitterX } from "react-icons/bs";
import RevealY from "./RevealY";
import { motion, useInView } from "motion/react";
import AnimatedText from "./AnimatedText";
import AnimatedInput from "./AnimatedInput";

const sitemapLinks = ["Home", "Documentation", "Resources"];
const companyLinks = ["Licensing", "Terms & Conditions", "Privacy Policy"];
const contactLinks = ["FAQ", "Support"];

const footerLinks = (title: string, links: string[]) => (
  <div className="flex flex-col gap-5">
    <RevealY delay={0.1}>
      <h4 className="text-[#787776] uppercase text-xs tra">{title}</h4>
    </RevealY>
    <ul className="space-y-1 text-sm text-white font-medium">
      {links.map((text, i) => (
        <RevealY delay={i * 0.1 + 0.2} key={text}>
          <li className="w-fit">
            <AnimatedText>{text}</AnimatedText>
          </li>
        </RevealY>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const logoRef = useRef(null);
  const isInView = useInView(logoRef, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <div className="w-full h-fit font-neue-montreal items-center flex flex-col overflow-hidden">
      <div className="h-[1px] w-[80%] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative">
        {footerLinks("Sitemap", sitemapLinks)}
        {footerLinks("Company", companyLinks)}
        {footerLinks("Contact", contactLinks)}

        <div className="space-y-4">
          <h4 className="text-[10px] tracking-widest text-zinc-500 uppercase">
            Contact us
          </h4>
          <form className="flex flex-wrap gap-4">
            <AnimatedInput type="text" placeholder="First name" />
            <AnimatedInput type="email" placeholder="john.doe@anvil.dev" />
          </form>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute -bottom-[200px] left-0 w-full -z-10 flex justify-between">
          <span className="text-[28vw] tracking-wider font-medium text-[#131313]">
            Anvil
          </span>
          <div
            className="flex items-center justify-center p-4"
            id="logo"
            ref={logoRef}
          >
            <motion.div
              className="w-96 h-96 border-[30px] border-[#131313] rounded-full flex items-center justify-center relative"
              animate={isInView ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div className="absolute left-0 top-1/2 transform -translate-x-2/3 -translate-y-1/2 w-20 h-20 bg-[#131313] rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform translate-x-2/3 -translate-y-1/2 w-20 h-20 bg-[#131313] rounded-full"></div>
              <img
                src="/icons/logo-dark.png"
                alt="Center image"
                className="w-80 h-80 object-cover rounded-full"
              />
            </motion.div>
          </div>
        </div>
        <div className="relative pt-52 pb-5 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-300 z-10">
          <p>©{new Date().getFullYear()} Anvil. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#">
              <BsLinkedin />
            </a>
            <a href="#">
              <BsInstagram />
            </a>
            <a href="#">
              <BsTwitterX />
            </a>
          </div>
          <p className="tracking-wide">A THING BY AGNISH AND ADITYA</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
