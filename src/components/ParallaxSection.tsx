import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number; // Distance in pixels to translate on scroll
  className?: string;
  id?: string;
}

export default function ParallaxSection({
  children,
  speed = 30,
  className = "",
  id,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll position of the element relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate gentle parallax offset (translating the element opposite to scroll direction)
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div id={id} ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}
