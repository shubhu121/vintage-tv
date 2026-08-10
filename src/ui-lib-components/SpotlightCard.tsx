import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function SpotlightCard({ children, className = '', ...props }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={cardRef}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.15),
              transparent 80%
            )
          `,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.04),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
