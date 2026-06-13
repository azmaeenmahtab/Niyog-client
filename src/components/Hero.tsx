"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import HeroText from "@/components/HeroText";
import globeImage from "@/assets/Group.png";

const starSeed = [
  { top: 6, left: 10, size: 3, delay: 0.2 },
  { top: 12, left: 24, size: 2, delay: 1.1 },
  { top: 8, left: 40, size: 3, delay: 0.7 },
  { top: 15, left: 68, size: 2, delay: 0.4 },
  { top: 10, left: 84, size: 3, delay: 1.4 },
  { top: 22, left: 16, size: 2, delay: 0.9 },
  { top: 26, left: 52, size: 2, delay: 1.7 },
  { top: 30, left: 77, size: 3, delay: 1.2 },
  { top: 38, left: 9, size: 2, delay: 0.5 },
  { top: 42, left: 91, size: 2, delay: 0.8 },
  { top: 49, left: 20, size: 3, delay: 1.6 },
  { top: 56, left: 74, size: 2, delay: 0.3 },
];

const stars = Array.from({ length: 5 }, (_, layerIndex) =>
  starSeed.map((star, starIndex) => ({
    top: `${(star.top + layerIndex * 8 + (starIndex % 3) * 1.5) % 100}%`,
    left: `${(star.left + layerIndex * 13 + (starIndex % 4) * 1.2) % 100}%`,
    size: star.size,
    delay: star.delay + layerIndex * 0.35,
  }))
).flat();

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] text-white pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,76,255,0.22),transparent_34%),linear-gradient(180deg,#090909_0%,#040404_100%)]" />

      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, index) => (
          <motion.span
            key={`${star.top}-${star.left}-${index}`}
            className="absolute rounded-full bg-[#aca7ff] shadow-[0_0_12px_rgba(132,118,255,0.9)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.6, 1] }}
            transition={{ duration: 4.5, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[-12vw] flex justify-center sm:bottom-[-15vw] lg:bottom-[-35vw]">
        <div className="relative aspect-square w-[132vw] max-w-350 sm:w-[126vw] lg:w-[120vw]">
          <div className="absolute inset-[7%] flex items-center justify-center opacity-92">
            <Image
              src={globeImage}
              alt="Animated globe"
              className="h-full w-full object-contain drop-shadow-[0_0_30px_rgba(98,82,255,0.45)]"
              priority
            />
          </div>
          <div className="absolute inset-[4%] rounded-full shadow-[inset_0_0_130px_rgba(0,0,0,0.74),inset_0_20px_90px_rgba(255,255,255,0.04)]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-245 w-full max-w-7xl items-start justify-center px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <HeroText />
      </div>
    </section>
  );
}
