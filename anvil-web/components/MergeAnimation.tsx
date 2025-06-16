"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

// Define allowed neon color keys
type NeonColorKey = "green" | "pink";

// Define the structure of a code line
interface CodeLine {
  text: string;
  color?: NeonColorKey;
}

// Responsive configuration
interface ResponsiveConfig {
  gap: number;
  addonWidth: number;
  mainWidth: {
    initial: number;
    merged: number;
  };
  mainHeight: {
    initial: number;
    merged: number;
  };
  lineWidth: number;
  fontSize: string;
  padding: string;
  headerPadding: string;
  lineSpacing: string;
  animationDistance: number;
}

const getResponsiveConfig = (screenSize: 'mobile' | 'tablet' | 'desktop'): ResponsiveConfig => {
  const configs = {
    mobile: {
      gap: 4,
      addonWidth: 200,
      mainWidth: { initial: 200, merged: 300 },
      mainHeight: { initial: 160, merged: 200 },
      lineWidth: 180,
      fontSize: 'text-[10px]',
      padding: 'p-2',
      headerPadding: 'px-2 py-1',
      lineSpacing: 'space-y-1',
      animationDistance: 180,
    },
    tablet: {
      gap: 6,
      addonWidth: 240,
      mainWidth: { initial: 240, merged: 360 },
      mainHeight: { initial: 180, merged: 220 },
      lineWidth: 220,
      fontSize: 'text-[11px]',
      padding: 'p-2.5',
      headerPadding: 'px-2.5 py-1',
      lineSpacing: 'space-y-1.5',
      animationDistance: 220,
    },
    desktop: {
      gap: 10,
      addonWidth: 280,
      mainWidth: { initial: 280, merged: 460 },
      mainHeight: { initial: 200, merged: 250 },
      lineWidth: 260,
      fontSize: 'text-xs',
      padding: 'p-3',
      headerPadding: 'px-3 py-1',
      lineSpacing: 'space-y-2',
      animationDistance: 260,
    },
  };
  
  return configs[screenSize];
};

// Neon color mappings
const neonColors: Record<NeonColorKey, { bg: string; shadow: string }> = {
  green: {
    bg: "#00FFAB",
    shadow: "0 0 6px #00FFAB, 0 0 12px #00FFAB",
  },
  pink: {
    bg: "#FF4CD8",
    shadow: "0 0 6px #FF4CD8, 0 0 12px #FF4CD8",
  },
};

// Shared lines that appear in both files
const sharedLines: CodeLine[] = [
  { text: "function init() {" },
  { text: "  console.log('ready');" },
  { text: "}" },
  { text: "export default init;" },
];

// Lines that will be merged
const addonLines: (CodeLine & { delay: number })[] = [
  { text: "import utils from './utils';", color: "green", delay: 0 },
  { text: "const config = { env: 'prod' };", color: "pink", delay: 0.3 },
];

export default function MergeAnimation() {
  const [merged, setMerged] = useState(false);
  const [visibleAddon, setVisibleAddon] = useState(true);
  const [mainLines, setMainLines] = useState<CodeLine[]>([...sharedLines]);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const config = getResponsiveConfig(screenSize);

  useEffect(() => {
    if (merged) {
      addonLines.forEach((line) => {
        setTimeout(() => {
          setMainLines((prev) => {
            const importLines = prev.filter((l) => l.text.startsWith("import"));
            const rest = prev.filter((l) => !l.text.startsWith("import"));
            return [...importLines, { text: line.text, color: line.color }, ...rest];
          });
        }, (line.delay + 0.8) * 1000);
      });

      setTimeout(() => {
        setVisibleAddon(false);
      }, 1000);
    }
  }, [merged]);

  const handleMerge = () => {
    if (!merged) setMerged(true);
  };

  // Shared file container style
  const fileBaseStyle = `rounded-lg ${config.fontSize} font-mono text-white overflow-hidden shadow-xl border border-zinc-700 bg-zinc-800`;

  return (
    <div
      className={`absolute inset-0 flex items-start justify-center px-2 pt-4 md:px-4 md:pt-6 lg:pt-10`}
      style={{ gap: config.gap }}
      onMouseEnter={handleMerge}
    >
      {/* Addon File */}
      <AnimatePresence>
        {visibleAddon && (
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.9 }}
            transition={{ duration: 1 }}
            className={`${fileBaseStyle} w-fit`}
            style={{ width: config.addonWidth }}
          >
            <div className={`bg-zinc-900 text-zinc-400 ${config.headerPadding} border-b border-zinc-700`}>
              addon.ts
            </div>
            <div className={`${config.padding} ${config.lineSpacing}`}>
              {[
                ...addonLines.map((line, i) => {
                  const neon = line.color ? neonColors[line.color] : null;
                  return (
                    <motion.div
                      key={`addon-${i}`}
                      initial={{ opacity: 1 }}
                      animate={{
                        x: merged ? config.animationDistance : 0,
                        opacity: merged ? 0 : 1,
                      }}
                      transition={{
                        delay: merged ? line.delay : 0,
                        duration: 1.4,
                        ease: "easeInOut",
                      }}
                      className="flex gap-1 md:gap-2 items-center"
                    >
                      <span className="text-zinc-500 w-3 md:w-4 text-right text-[9px] md:text-xs">{i + 1}</span>
                      <div
                        className="h-5 md:h-6 px-2 md:px-3 py-1 rounded-md truncate flex items-center text-[9px] md:text-xs"
                        style={{
                          width: config.lineWidth,
                          backgroundColor: neon?.bg ?? "#3f3f46",
                          boxShadow: neon?.shadow ?? "none",
                        }}
                      >
                        {line.text}
                      </div>
                    </motion.div>
                  );
                }),
                ...sharedLines.map((line, i) => (
                  <div key={`addon-shared-${i}`} className="flex gap-1 md:gap-2 items-center">
                    <span className="text-zinc-500 w-3 md:w-4 text-right text-[9px] md:text-xs">
                      {addonLines.length + i + 1}
                    </span>
                    <div
                      className="h-5 md:h-6 px-2 md:px-3 py-1 rounded-md truncate flex items-center text-[9px] md:text-xs"
                      style={{
                        width: config.lineWidth,
                        backgroundColor: "#3f3f46",
                      }}
                    >
                      {line.text}
                    </div>
                  </div>
                )),
              ]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main File */}
      <motion.div
        animate={{
          width: merged ? config.mainWidth.merged : config.mainWidth.initial,
          height: merged ? config.mainHeight.merged : config.mainHeight.initial,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={`${fileBaseStyle} relative`}
      >
        <div className={`bg-zinc-900 text-zinc-400 ${config.headerPadding} border-b border-zinc-700`}>
          main.ts
        </div>
        <div className={`${config.padding} ${config.lineSpacing}`}>
          {mainLines.map((line, i) => {
            const neon = line.color ? neonColors[line.color] : null;
            return (
              <motion.div
                key={`main-${i}-${line.text}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: 0.05 * i,
                }}
                className="flex gap-1 md:gap-2 items-center"
              >
                <span className="text-zinc-500 w-3 md:w-4 text-right text-[9px] md:text-xs">{i + 1}</span>
                <motion.div
                  initial={{ backgroundColor: "#3f3f46" }}
                  animate={{
                    backgroundColor: neon?.bg ?? "#3f3f46",
                    boxShadow: neon?.shadow ?? "none",
                  }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="h-5 md:h-6 px-2 md:px-3 py-1 rounded-md truncate flex items-center text-[9px] md:text-xs"
                  style={{
                    width: merged ? config.lineWidth + 60 : config.lineWidth,
                  }}
                >
                  {line.text}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}