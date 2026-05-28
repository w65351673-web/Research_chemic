'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Particles with no SSR to prevent hydration issues
const Particles = dynamic(() => import('react-tsparticles'), { ssr: false });
import { loadSlim } from 'tsparticles-slim';

export default function EnhancedParticles({ className = '' }) {
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Show a placeholder while loading to prevent layout shift
  if (!mounted) {
    return (
      <div className={`absolute inset-0 z-0 ${className} bg-gradient-to-b from-gray-900/50 to-black/50`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_rgba(138,43,226,0.3)_0%,_transparent_70%)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false,
          },
          fpsLimit: 120,
          particles: {
            number: {
              value: 120,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: ["#9333ea", "#a855f7", "#c084fc", "#e879f9", "#f0abfc", "#e11d48", "#06b6d4"]
            },
            shape: {
              type: ["circle", "triangle", "polygon", "star"],
              polygon: {
                sides: 6
              },
              star: {
                sides: 5
              }
            },
            opacity: {
              value: 0.7,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.2,
                sync: false
              }
            },
            size: {
              value: 8,
              random: true,
              anim: {
                enable: true,
                speed: 4,
                size_min: 1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#a855f7",
              opacity: 0.4,
              width: 1.5,
              triangles: {
                enable: true,
                opacity: 0.1,
                color: "#c084fc"
              }
            },
            move: {
              enable: true,
              speed: 3,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              },
              trail: {
                enable: true,
                length: 10,
                fill: {
                  color: "#9333ea"
                }
              }
            },
            life: {
              duration: {
                value: 3
              },
              count: 1
            },
            rotate: {
              value: 45,
              random: true,
              direction: "random",
              animation: {
                enable: true,
                speed: 5
              }
            },
            stroke: {
              width: 1,
              color: "#a855f7"
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "bubble"
              },
              onclick: {
                enable: true,
                mode: "repulse"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 200,
                size: 15,
                duration: 2,
                opacity: 0.8,
                speed: 3,
                color: {
                  value: ["#9333ea", "#e11d48", "#06b6d4"]
                }
              },
              repulse: {
                distance: 200,
                duration: 0.4,
                speed: 5
              },
              push: {
                particles_nb: 10
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true,
          background: {
            color: "transparent",
            image: "",
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover"
          },
          detectRetina: true,
          emitters: [
            {
              direction: "top",
              rate: {
                quantity: 3,
                delay: 1
              },
              position: {
                x: 50,
                y: 100
              },
              size: {
                width: 100,
                height: 0
              },
              particles: {
                color: {
                  value: ["#9333ea", "#e11d48", "#06b6d4"]
                },
                move: {
                  speed: 5
                }
              }
            }
          ]
        }}
      />
    </div>
  );
}
