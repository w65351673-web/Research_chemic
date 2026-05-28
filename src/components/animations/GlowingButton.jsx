'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function GlowingButton({ 
  href, 
  children, 
  className = '', 
  onClick,
  glowColor = 'rgba(13, 148, 136, 0.6)',
  ...props 
}) {
  const buttonRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    // Only run GSAP animations on the client side
    if (typeof window === 'undefined' || !buttonRef.current) return;
    
    const button = buttonRef.current;
    
    // Create the glow effect timeline
    const timeline = gsap.timeline({ repeat: -1, yoyo: true });
    
    timeline.to(button, {
      boxShadow: `0 0 20px ${glowColor}, 0 0 30px ${glowColor.replace('0.6', '0.3')}`,
      duration: 1.5,
      ease: "sine.inOut"
    });
    
    timeline.to(button, {
      boxShadow: `0 0 10px ${glowColor.replace('0.6', '0.3')}`,
      duration: 1.5,
      ease: "sine.inOut"
    });
    
    // Handle hover effect
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        boxShadow: `0 0 25px ${glowColor}, 0 0 40px ${glowColor.replace('0.6', '0.4')}`,
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      gsap.killTweensOf(button);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowColor]);
  
  // Use client-side only effect for ripple animations to avoid hydration errors
  // Initialize with empty styles for consistent server rendering
  const [rippleStyles, setRippleStyles] = useState(Array(5).fill({ opacity: 0 }));
  
  // Generate ripple styles only on the client side
  useEffect(() => {
    // Check if we're running on the client side
    if (typeof window !== 'undefined') {
      const newStyles = Array.from({ length: 5 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: 'translate(-50%, -50%) scale(0)',
        animation: `ripple ${2 + Math.random() * 4}s linear infinite ${Math.random() * 2}s`
      }));
      setRippleStyles(newStyles);
    }
  }, []);
  
  // Ripple effect JSX - always render same structure
  const rippleEffect = (
    <span className="absolute inset-0 overflow-hidden rounded-lg">
      {rippleStyles.map((style, i) => (
        <span
          key={i}
          className="absolute w-[200%] aspect-square rounded-full bg-white/10"
          style={style}
        />
      ))}
    </span>
  );
  
  // Animation styles - render unconditionally
  const AnimationStyles = () => (
    <style jsx global>{`
      @keyframes ripple {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
        }
      }
    `}</style>
  );
  
  // Use the appropriate component based on whether we have an href
  if (href) {
    return (
      <>
        <AnimationStyles />
        {mounted ? (
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Link
              href={href}
              ref={buttonRef}
              className={`relative overflow-hidden bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ${className}`}
              {...props}
            >
              {rippleEffect}
              <span className="relative z-10">{children}</span>
            </Link>
          </motion.div>
        ) : (
          <Link
            href={href}
            ref={buttonRef}
            className={`relative overflow-hidden bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 inline-block ${className}`}
            {...props}
          >
            {rippleEffect}
            <span className="relative z-10">{children}</span>
          </Link>
        )}
      </>
    );
  }
  
  // For buttons (no href)
  return (
    <>
      <AnimationStyles />
      {mounted ? (
        <motion.button
          ref={buttonRef}
          onClick={onClick}
          className={`relative overflow-hidden bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ${className}`}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          {rippleEffect}
          <span className="relative z-10">{children}</span>
        </motion.button>
      ) : (
        <button
          ref={buttonRef}
          onClick={onClick}
          className={`relative overflow-hidden bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ${className}`}
          {...props}
        >
          {rippleEffect}
          <span className="relative z-10">{children}</span>
        </button>
      )}
    </>
  );
}
