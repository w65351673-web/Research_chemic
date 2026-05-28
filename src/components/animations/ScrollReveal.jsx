'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function ScrollReveal({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  direction = 'up', // 'up', 'down', 'left', 'right'
  distance = 50,
  once = true,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, threshold });
  const controls = useAnimation();
  
  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 };
      case 'down': return { y: -distance, opacity: 0 };
      case 'left': return { x: distance, opacity: 0 };
      case 'right': return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };
  
  // Calculate animation target based on direction
  const getAnimationTarget = () => {
    switch (direction) {
      case 'up': 
      case 'down': 
        return { y: 0, opacity: 1 };
      case 'left': 
      case 'right': 
        return { x: 0, opacity: 1 };
      default: 
        return { y: 0, opacity: 1 };
    }
  };
  
  useEffect(() => {
    if (isInView) {
      controls.start(getAnimationTarget());
    }
  }, [isInView, controls]);
  
  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={controls}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: delay,
        duration: duration
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
