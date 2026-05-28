'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Trail, useGLTF, PerspectiveCamera, MeshDistortMaterial, GradientTexture } from '@react-three/drei';

// Enhanced Atom component with glow and distortion
const Atom = ({ position, color, size = 1, pulseSpeed = 1 }) => {
  const meshRef = useRef();
  const time = useRef(Math.random() * 100);
  
  // Animate the atom with pulsing and slight movement
  useFrame((state) => {
    time.current += 0.01 * pulseSpeed;
    if (meshRef.current) {
      meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = 
        size * (0.9 + Math.sin(time.current) * 0.1);
      
      // Slight random movement
      meshRef.current.position.x = position[0] + Math.sin(time.current * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.cos(time.current * 0.3) * 0.1;
      meshRef.current.position.z = position[2] + Math.sin(time.current * 0.4) * 0.1;
    }
  });

  return (
    <group>
      {/* Glow sphere */}
      <Sphere args={[size * 1.2, 16, 16]} position={position}>
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </Sphere>
      
      {/* Main atom sphere with distortion */}
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <MeshDistortMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.8}
          distort={0.2} 
          speed={2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </group>
  );
};

// Enhanced Bond component with trail effect
const Bond = ({ start, end, color }) => {
  const lineRef = useRef();
  const time = useRef(0);
  
  useFrame(() => {
    time.current += 0.01;
    if (lineRef.current) {
      lineRef.current.material.dashOffset = time.current;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={color}
      lineWidth={3}
      dashed
      dashSize={0.2}
      dashOffset={0}
      dashScale={1}
      transparent
      opacity={0.8}
    />
  );
};

// Floating particles around the molecule
const Particles = ({ count = 20, radius = 8 }) => {
  const particles = useRef([]);
  const group = useRef();
  
  // Initialize particles
  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * radius,
        (Math.random() - 0.5) * radius,
        (Math.random() - 0.5) * radius
      ],
      size: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
      offset: Math.random() * Math.PI * 2
    }));
  }, [count, radius]);
  
  // Animate particles
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (group.current) {
      group.current.children.forEach((particle, i) => {
        const data = particles.current[i];
        
        // Circular motion with slight randomness
        particle.position.x = data.position[0] + Math.sin(t * data.speed + data.offset) * 2;
        particle.position.y = data.position[1] + Math.cos(t * data.speed + data.offset) * 2;
        particle.position.z = data.position[2] + Math.sin(t * data.speed * 0.7 + data.offset) * 2;
        
        // Pulse size
        particle.scale.x = particle.scale.y = particle.scale.z = 
          data.size * (0.8 + Math.sin(t * data.speed * 2) * 0.2);
      });
    }
  });
  
  return (
    <group ref={group}>
      {particles.current.map((data, i) => (
        <Sphere key={i} args={[1, 8, 8]} position={data.position}>
          <meshBasicMaterial 
            color={i % 3 === 0 ? '#9333ea' : (i % 3 === 1 ? '#e11d48' : '#06b6d4')} 
            transparent 
            opacity={0.4} 
          />
        </Sphere>
      ))}
    </group>
  );
};

// Enhanced rotating molecule component
const Molecule = ({ rotationSpeed = 0.003 }) => {
  const groupRef = useRef();
  
  // Rotate the molecule
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = t * rotationSpeed * 10;
      groupRef.current.rotation.z = Math.sin(t * rotationSpeed * 5) * 0.3;
    }
  });

  // Define molecule structure - this is a simplified THC-like structure
  const atoms = [
    { position: [0, 0, 0], color: "#9333ea", size: 0.8, pulseSpeed: 1.2 },        // Central carbon
    { position: [2, 0, 0], color: "#9333ea", size: 0.8, pulseSpeed: 0.9 },        // Carbon
    { position: [2.5, 1.5, 0], color: "#9333ea", size: 0.8, pulseSpeed: 1.1 },    // Carbon
    { position: [1, 2, 0], color: "#9333ea", size: 0.8, pulseSpeed: 0.8 },        // Carbon
    { position: [-0.5, 1.5, 0], color: "#9333ea", size: 0.8, pulseSpeed: 1.3 },   // Carbon
    { position: [0, -2, 0], color: "#9333ea", size: 0.8, pulseSpeed: 1.0 },       // Carbon chain
    { position: [1, -3, 1], color: "#9333ea", size: 0.8, pulseSpeed: 1.2 },       // Carbon chain
    { position: [0, -4, 2], color: "#9333ea", size: 0.8, pulseSpeed: 0.9 },       // Carbon chain
    { position: [3, -1, 1], color: "#e11d48", size: 0.7, pulseSpeed: 1.4 },       // Oxygen
    { position: [-1, -1, 1], color: "#06b6d4", size: 0.7, pulseSpeed: 1.5 },      // Nitrogen
    { position: [3, 2, 1], color: "#e11d48", size: 0.7, pulseSpeed: 1.3 },        // Oxygen
  ];

  const bonds = [
    { start: [0, 0, 0], end: [2, 0, 0], color: "#a855f7" },
    { start: [2, 0, 0], end: [2.5, 1.5, 0], color: "#a855f7" },
    { start: [2.5, 1.5, 0], end: [1, 2, 0], color: "#a855f7" },
    { start: [1, 2, 0], end: [-0.5, 1.5, 0], color: "#a855f7" },
    { start: [-0.5, 1.5, 0], end: [0, 0, 0], color: "#a855f7" },
    { start: [0, 0, 0], end: [0, -2, 0], color: "#a855f7" },
    { start: [0, -2, 0], end: [1, -3, 1], color: "#a855f7" },
    { start: [1, -3, 1], end: [0, -4, 2], color: "#a855f7" },
    { start: [2, 0, 0], end: [3, -1, 1], color: "#ec4899" },
    { start: [0, 0, 0], end: [-1, -1, 1], color: "#0ea5e9" },
    { start: [2.5, 1.5, 0], end: [3, 2, 1], color: "#ec4899" },
  ];

  return (
    <group>
      <group ref={groupRef}>
        {atoms.map((atom, index) => (
          <Atom 
            key={`atom-${index}`} 
            position={atom.position} 
            color={atom.color} 
            size={atom.size}
            pulseSpeed={atom.pulseSpeed} 
          />
        ))}
        {bonds.map((bond, index) => (
          <Bond key={`bond-${index}`} start={bond.start} end={bond.end} color={bond.color} />
        ))}
      </group>
      <Particles count={30} radius={10} />
    </group>
  );
};

// Scene setup component with camera animation
const Scene = () => {
  const cameraRef = useRef();
  
  // Animate camera position for a more dynamic view
  useFrame(({ clock }) => {
    if (cameraRef.current) {
      const t = clock.getElapsedTime();
      const radius = 15 + Math.sin(t * 0.1) * 2;
      const angle = t * 0.1;
      
      cameraRef.current.position.x = Math.sin(angle) * radius;
      cameraRef.current.position.z = Math.cos(angle) * radius;
      cameraRef.current.position.y = Math.sin(t * 0.05) * 3;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });
  
  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={40} />
      
      {/* Dynamic lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
      <pointLight position={[8, -5, 0]} intensity={1} color="#e11d48" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#000', 15, 30]} />
      
      {/* Main molecule */}
      <Molecule rotationSpeed={0.005} />
    </>
  );
};

export default function MoleculeModel3D({ className = '' }) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [error, setError] = useState(null);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
      console.warn('WebGL not supported, using fallback animation');
    }
  }, []);

  // Handle Canvas errors
  const handleCreated = ({ gl }) => {
    try {
      gl.getExtension('WEBGL_lose_context');
    } catch (e) {
      setError(e);
      setWebglSupported(false);
    }
  };

  // Fallback for old GPUs - simple CSS animation
  if (!webglSupported || error) {
    return (
      <div className={`w-full h-full ${className} flex items-center justify-center`}>
        <div className="relative w-64 h-64">
          {/* Simple CSS molecule animation */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-sky-500 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-sky-500 rounded-full opacity-40 blur-lg"></div>
            <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-sky-500 rounded-full opacity-40 blur-lg"></div>
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-sky-500 rounded-full opacity-40 blur-lg"></div>
            <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-sky-500 rounded-full opacity-40 blur-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false // Don't fail on old GPUs
        }}
        onCreated={handleCreated}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
