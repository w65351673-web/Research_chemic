'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });

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

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(width * height / 10000), 100);
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          color: `rgba(128, 90, 213, ${Math.random() * 0.5 + 0.2})`, // Purple with varying opacity
          vx: Math.random() * 0.5 - 0.25,
          vy: Math.random() * 0.5 - 0.25,
          originX: Math.random() * width,
          originY: Math.random() * height,
        });
      }
    };

    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw particles
      particles.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      // Draw connections
      ctx.beginPath();
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = 'rgba(128, 90, 213, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    // Update particles
    const updateParticles = () => {
      particles.current.forEach(particle => {
        // Add mouse influence
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = 0.2 * (1 - distance / 200);
          particle.vx -= force * dx / distance;
          particle.vy -= force * dy / distance;
        }
        
        // Add some randomness
        if (Math.random() < 0.01) {
          particle.vx = Math.random() * 0.5 - 0.25;
          particle.vy = Math.random() * 0.5 - 0.25;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        
        // Gradually return to origin
        particle.x += (particle.originX - particle.x) * 0.003;
        particle.y += (particle.originY - particle.y) * 0.003;
      });
    };

    // Animation loop
    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    // Handle resize
    const handleResize = () => {
      setCanvasDimensions();
      initParticles();
    };

    // Initialize
    setCanvasDimensions();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
