'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TypedText({
  text,
  className = '',
  speed = 40,
  delay = 0,
  cursor = true,
  onComplete = () => {},
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const index = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Reset when text changes
    index.current = 0;
    setDisplayedText('');
    setIsComplete(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Delay the start of typing
    const startTimeout = setTimeout(() => {
      typeNextCharacter();
    }, delay);
    
    return () => {
      clearTimeout(startTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay]);

  const typeNextCharacter = () => {
    if (index.current < text.length) {
      // Ensure we're adding the correct character
      const nextChar = text.charAt(index.current);
      setDisplayedText(prev => prev + nextChar);
      index.current += 1;
      
      // Schedule next character
      timeoutRef.current = setTimeout(
        typeNextCharacter,
        // Vary the typing speed slightly for a more natural effect
        speed * (0.8 + Math.random() * 0.4)
      );
    } else {
      setIsComplete(true);
      onComplete();
    }
  };

  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.8,
            times: [0, 0.5, 1]
          }}
          className="inline-block w-[2px] h-[1em] bg-sky-400 ml-1"
        />
      )}
    </motion.span>
  );
}
