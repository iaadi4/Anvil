'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Keep loader on screen for 3 extra seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000); // 3s artificial delay

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-4"
            style={{
              borderColor: '#FF4C24',
              width: '100%',
              height: '100%',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
        <div className="absolute w-6 h-6 bg-[#FF4C24] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
