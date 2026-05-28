'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function FloatingElement({ 
  children, 
  delay = 0,
  duration = 3,
  yOffset = 15,
  glowColor = 'rgba(128, 90, 213, 0.6)',
  className = '',
  ...props 
}) {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Create floating animation
    gsap.to(element, {
      y: yOffset,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: delay,
    });
    
    // Create subtle rotation
    gsap.to(element, {
      rotateZ: '3deg',
      duration: duration * 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: delay + 0.2,
    });
    
    // Create pulsing glow effect
    const glowTimeline = gsap.timeline({ repeat: -1 });
    glowTimeline.to(element, {
      boxShadow: `0 0 20px ${glowColor}`,
      duration: duration * 0.7,
      ease: "sine.inOut"
    });
    glowTimeline.to(element, {
      boxShadow: `0 0 10px ${glowColor.replace('0.6', '0.3')}`,
      duration: duration * 0.7,
      ease: "sine.inOut"
    });
    
    return () => {
      gsap.killTweensOf(element);
    };
  }, [delay, duration, yOffset, glowColor]);
  
  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.3 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
