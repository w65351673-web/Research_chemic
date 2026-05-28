'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MoleculeAnimation() {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Get all nodes and bonds
    const nodes = svgRef.current.querySelectorAll('.molecule-node');
    const bonds = svgRef.current.querySelectorAll('.molecule-bond');
    
    // Animate nodes
    nodes.forEach((node, i) => {
      // Initial setup
      gsap.set(node, { 
        scale: 0,
        opacity: 0,
      });
      
      // Animate in
      gsap.to(node, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.1,
        ease: "back.out(1.7)",
      });
      
      // Continuous pulse animation
      gsap.to(node, {
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        duration: 2 + i * 0.5,
        delay: i * 0.1,
        ease: "sine.inOut",
      });
    });
    
    // Animate bonds
    bonds.forEach((bond, i) => {
      // Get the length of the bond line
      const length = bond.getTotalLength();
      
      // Initial setup - hide the bond
      gsap.set(bond, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.3,
      });
      
      // Animate the bond drawing
      gsap.to(bond, {
        strokeDashoffset: 0,
        duration: 1,
        delay: 0.5 + i * 0.15,
        ease: "power2.inOut",
      });
      
      // Pulse the opacity
      gsap.to(bond, {
        opacity: 0.8,
        repeat: -1,
        yoyo: true,
        duration: 1.5 + i * 0.3,
        delay: 1 + i * 0.15,
        ease: "sine.inOut",
      });
    });
    
    // Rotate the entire molecule
    gsap.to(svgRef.current.querySelector('.molecule-group'), {
      rotation: 360,
      transformOrigin: "center center",
      repeat: -1,
      duration: 60,
      ease: "none",
    });
    
    return () => {
      // Clean up animations
      gsap.killTweensOf(nodes);
      gsap.killTweensOf(bonds);
      gsap.killTweensOf(svgRef.current?.querySelector('.molecule-group'));
    };
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-40">
      <svg 
        ref={svgRef} 
        viewBox="0 0 400 400" 
        width="100%" 
        height="100%" 
        className="max-w-[600px] max-h-[600px]"
      >
        <g className="molecule-group">
          {/* Nodes (atoms) */}
          <circle cx="200" cy="200" r="15" className="molecule-node fill-sky-500" />
          <circle cx="250" cy="150" r="12" className="molecule-node fill-sky-500" />
          <circle cx="150" cy="150" r="12" className="molecule-node fill-sky-500" />
          <circle cx="150" cy="250" r="12" className="molecule-node fill-sky-500" />
          <circle cx="250" cy="250" r="12" className="molecule-node fill-sky-500" />
          <circle cx="300" cy="200" r="10" className="molecule-node fill-sky-400" />
          <circle cx="100" cy="200" r="10" className="molecule-node fill-sky-400" />
          <circle cx="200" cy="300" r="10" className="molecule-node fill-sky-400" />
          <circle cx="200" cy="100" r="10" className="molecule-node fill-sky-400" />
          
          {/* Bonds */}
          <line x1="200" y1="200" x2="250" y2="150" className="molecule-bond stroke-sky-500" strokeWidth="3" />
          <line x1="200" y1="200" x2="150" y2="150" className="molecule-bond stroke-sky-500" strokeWidth="3" />
          <line x1="200" y1="200" x2="150" y2="250" className="molecule-bond stroke-sky-500" strokeWidth="3" />
          <line x1="200" y1="200" x2="250" y2="250" className="molecule-bond stroke-sky-500" strokeWidth="3" />
          <line x1="250" y1="150" x2="200" y2="100" className="molecule-bond stroke-sky-400" strokeWidth="2" />
          <line x1="150" y1="150" x2="100" y2="200" className="molecule-bond stroke-sky-400" strokeWidth="2" />
          <line x1="150" y1="250" x2="200" y2="300" className="molecule-bond stroke-sky-400" strokeWidth="2" />
          <line x1="250" y1="250" x2="300" y2="200" className="molecule-bond stroke-sky-400" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
