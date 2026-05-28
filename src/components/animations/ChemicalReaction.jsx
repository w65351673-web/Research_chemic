'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ChemicalReaction() {
  const canvasRef = useRef(null);
  const bubbles = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Create bubbles
    const createBubbles = () => {
      bubbles.current = [];
      const bubbleCount = Math.min(Math.floor(width * height / 40000), 50);
      
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.current.push({
          x: Math.random() * width,
          y: height + Math.random() * 100,
          radius: Math.random() * 30 + 10,
          color: `rgba(${128 + Math.random() * 40}, ${90 + Math.random() * 30}, ${213 + Math.random() * 42}, ${Math.random() * 0.2 + 0.1})`,
          speed: Math.random() * 2 + 0.5,
          wobble: Math.random() * 0.5 + 0.1,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          wobbleOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    
    // Draw bubbles
    const drawBubbles = () => {
      ctx.clearRect(0, 0, width, height);
      
      bubbles.current.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        
        // Add highlight to make it look more like a bubble
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3, 
          bubble.y - bubble.radius * 0.3, 
          0, 
          bubble.x, 
          bubble.y, 
          bubble.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };
    
    // Update bubbles
    const updateBubbles = (time) => {
      bubbles.current.forEach(bubble => {
        // Move upward
        bubble.y -= bubble.speed;
        
        // Add wobble
        bubble.x += Math.sin(time * bubble.wobbleSpeed + bubble.wobbleOffset) * bubble.wobble;
        
        // Reset if out of view
        if (bubble.y + bubble.radius < 0) {
          bubble.y = height + bubble.radius;
          bubble.x = Math.random() * width;
        }
      });
    };
    
    // Animation loop
    let lastTime = 0;
    const animate = (time) => {
      updateBubbles(time);
      drawBubbles();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Handle resize
    const handleResize = () => {
      setCanvasDimensions();
      createBubbles();
    };
    
    // Initialize
    setCanvasDimensions();
    createBubbles();
    animate(0);
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
