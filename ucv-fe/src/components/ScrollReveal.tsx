import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    margin: '-100px' // Trigger animation 100px before element enters viewport
  });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialPosition = directions[direction];

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...initialPosition,
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : initialPosition.x,
        y: isInView ? 0 : initialPosition.y,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom ease for smooth animation
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredScrollRevealProps {
  children: ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function StaggeredScrollReveal({
  children,
  direction = 'up',
  staggerDelay = 0.1,
  duration = 0.6,
  once = true,
  className = '',
}: StaggeredScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    margin: '-100px'
  });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialPosition = directions[direction];

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            ...initialPosition,
          }}
          animate={{
            opacity: isInView ? 1 : 0,
            x: isInView ? 0 : initialPosition.x,
            y: isInView ? 0 : initialPosition.y,
          }}
          transition={{
            duration,
            delay: index * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

