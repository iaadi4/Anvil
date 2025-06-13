"use client";

import React, { useRef } from "react";
import RevealY from "./RevealY";

const Logo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  const handleAnvilHover = () => {
    if (logoRef.current) {
      logoRef.current.style.transform = "rotate(360deg)";
    }
  };

  const handleAnvilLeave = () => {
    if (logoRef.current) {
      logoRef.current.style.transform = "rotate(0deg)";
    }
  };

  return (
    <>
      <RevealY>
        <span
          onMouseEnter={handleAnvilHover}
          onMouseLeave={handleAnvilLeave}
          className="font-neue-montreal text-xl text-white font-medium tracking-widest cursor-pointer"
        >
          Anvil
        </span>
      </RevealY>
      <RevealY>
        <div className="flex items-center justify-center p-4">
          <div className="relative">
            <div
              ref={logoRef}
              className="w-10 h-10 border-[1px] border-white rounded-full flex items-center justify-center relative transition-transform duration-700 hover:rotate-[360deg]"
            >
              <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
              <img
                src="/icons/logo.png"
                alt="Center image"
                className="w-6 h-6 object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </RevealY>
    </>
  );
};

Logo.displayName = "Logo";

export default Logo;
