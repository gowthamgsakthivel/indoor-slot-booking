"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function SplashIntro({ onComplete }) {
  const textControls = useAnimation();
  const sweepControls = useAnimation();
  const barsControls = useAnimation();
  const underlineControls = useAnimation();

  useEffect(() => {
    async function sequence() {
      // Bars slide in
      await barsControls.start({
        x: "0%",
        opacity: 1,
        transition: { duration: 0.9, ease: "easeOut" },
      });
      // Wordmark reveal
      await textControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
      });
      // Light sweep on text
      sweepControls.start({
        x: "140%",
        transition: { duration: 1.1, ease: "easeInOut" },
      });
      // Underline extend
      underlineControls.start({
        scaleX: 1,
        transition: { duration: 0.7, ease: "easeOut" },
      });
      // Trigger completion after a short pause
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }
    sequence();
  }, [textControls, sweepControls, barsControls, underlineControls, onComplete]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_25%,rgba(255,130,60,0.2),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(120deg,rgba(255,150,70,0.12)_0%,rgba(0,0,0,0)_35%,rgba(255,90,20,0.1)_70%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_18%_18%,rgba(255,150,70,0.12),transparent_38%),radial-gradient(circle_at_82%_70%,rgba(255,90,20,0.12),transparent_45%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]" />

      {/* Kinetic bars */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1/2 bg-[linear-gradient(90deg,rgba(255,140,60,0.2),rgba(0,0,0,0))]"
        initial={{ x: "-100%", opacity: 0 }}
        animate={barsControls}
      />
      <motion.div
        className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(270deg,rgba(255,90,20,0.2),rgba(0,0,0,0))]"
        initial={{ x: "100%", opacity: 0 }}
        animate={barsControls}
      />

      {/* Brand lockup */}
      <motion.div
        className="relative z-10 flex h-full w-full items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={textControls}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 -left-full w-1/2 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.85),transparent)]"
              initial={{ x: "-120%" }}
              animate={sweepControls}
            />
            <h1
              className="text-5xl md:text-7xl font-extrabold uppercase tracking-[0.1em] text-white"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 10px 30px rgba(0,0,0,0.6)",
              }}
            >
              NAMAKKAL
            </h1>
          </div>
          <div
            className="mt-3 text-2xl md:text-4xl font-bold uppercase tracking-[0.2em] text-transparent"
            style={{
              fontFamily: "var(--font-body)",
              backgroundImage: "linear-gradient(90deg, #ff9b3f 0%, #ff5c1d 100%)",
              WebkitBackgroundClip: "text",
              textShadow: "0 8px 20px rgba(0,0,0,0.5)",
            }}
          >
            SPORTS CLUB
          </div>
          <motion.div
            className="mt-6 h-[2px] w-32 origin-left bg-[linear-gradient(90deg,transparent,rgba(255,155,70,0.95),rgba(255,90,20,0.95),transparent)]"
            initial={{ scaleX: 0 }}
            animate={underlineControls}
          />
        </div>
      </motion.div>
    </div>
  );
}
