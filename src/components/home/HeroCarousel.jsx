'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { FaArrowRight, FaArrowLeft, FaShieldAlt, FaTruck, FaCheckCircle, FaFlask, FaCertificate, FaGlobeAmericas, FaLock, FaBoxOpen, FaHeadset, FaStar } from 'react-icons/fa';

const slides = [
  {
    id: 0,
    image: '/images/Laboratory-Science.jpg',
    imagePos: 'object-center',
    pill: { color: 'bg-sky-500/20 border-sky-400/30', dot: 'bg-sky-400', text: 'text-sky-300', label: 'Quality Promise' },
    headline: 'Lab-Verified Purity.',
    accent: 'Zero Compromise.',
    accentColor: 'from-sky-300 via-cyan-300 to-sky-400',
    sub: "Don't risk your research on unverified sources. Every compound ships with an independent Certificate of Analysis, so you know exactly what you're getting — every single time.",
    href: '/products',
    cta: 'Shop Verified Compounds',
    ctaStyle: 'bg-sky-500 hover:bg-sky-400 shadow-sky-900/40',
    overlay: 'from-gray-900 via-gray-900/90 to-gray-900/60',
    stats: [
      { Icon: FaCertificate, value: '99.9%', label: 'Avg. Purity' },
      { Icon: FaCheckCircle, value: 'COA', label: 'Every Order' },
      { Icon: FaFlask, value: 'Batch', label: 'Tested' },
    ],
  },
  {
    id: 1,
    image: '/images/GettyImages-563374209.png',
    imagePos: 'object-top',
    pill: { color: 'bg-sky-500/20 border-sky-400/30', dot: 'bg-sky-400', text: 'text-sky-300', label: 'Worldwide Delivery' },
    headline: 'Delivered Fast.',
    accent: 'Anywhere on Earth.',
    accentColor: 'from-sky-300 via-cyan-300 to-sky-400',
    sub: 'Your order dispatched within 48 hours, discreetly packaged and fully tracked to over 50 countries. No customs headaches, no delays — just reliable delivery you can count on.',
    href: '/products',
    cta: 'Start Your Order',
    ctaStyle: 'bg-sky-500 hover:bg-sky-400 shadow-sky-900/40',
    overlay: 'from-gray-900 via-gray-900/90 to-gray-900/60',
    stats: [
      { Icon: FaTruck, value: '48h', label: 'Dispatch' },
      { Icon: FaGlobeAmericas, value: '50+', label: 'Countries' },
      { Icon: FaBoxOpen, value: 'Plain', label: 'Packaging' },
    ],
  },
  {
    id: 2,
    image: '/images/MA_0449a.webp',
    imagePos: 'object-center',
    pill: { color: 'bg-sky-500/20 border-sky-400/30', dot: 'bg-sky-400', text: 'text-sky-300', label: 'Trusted Supplier' },
    headline: '500+ Compounds.',
    accent: 'One Trusted Source.',
    accentColor: 'from-sky-300 via-cyan-300 to-sky-400',
    sub: 'Stop juggling multiple suppliers. From cannabinoids to novel research chemicals, get everything you need from one verified source — backed by 24/7 expert support whenever you need it.',
    href: '/products',
    cta: 'Explore Our Range',
    ctaStyle: 'bg-sky-500 hover:bg-sky-400 shadow-sky-900/40',
    overlay: 'from-gray-900 via-gray-900/90 to-gray-900/60',
    stats: [
      { Icon: FaFlask, value: '500+', label: 'Compounds' },
      { Icon: FaStar, value: '10K+', label: 'Researchers' },
      { Icon: FaHeadset, value: '24/7', label: 'Support' },
    ],
  },
];

const DURATION = 7000;

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top:  `${(i * 41  + 7)  % 93}%`,
  left: `${(i * 67  + 13) % 93}%`,
  size: [1, 2, 1, 3, 2, 3, 1, 2, 4, 2][i % 10],
  glow: i % 5 === 0,
}));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
  exit:   { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible:  { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6,  ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, y: -16, filter: 'blur(4px)', transition: { duration: 0.28, ease: 'easeIn' } },
};

const headVariants = {
  hidden:   { opacity: 0, y: 44, filter: 'blur(6px)' },
  visible:  { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7,  ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, y: -22, filter: 'blur(6px)', transition: { duration: 0.28, ease: 'easeIn' } },
};

const statVariants = {
  hidden:  { opacity: 0, scale: 0.82, y: 18 },
  visible: (i) => ({ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] } }),
  exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const particlesRef = useRef(null);

  const goTo = useCallback((i) => { setCurrent(i); setProgress(0); }, []);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    if (paused) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setProgress(p => { if (p >= 100) { next(); return 0; } return p + (100 / (DURATION / 50)); });
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [paused, next]);

  useEffect(() => {
    if (!particlesRef.current) return;
    const vw = window.innerWidth;
    const ctx = gsap.context(() => {

      // Twinkle every star individually
      gsap.utils.toArray('.hero-star', particlesRef.current).forEach((el) => {
        gsap.to(el, {
          opacity:  gsap.utils.random(0.15, 1.0),
          scale:    gsap.utils.random(0.5,  2.6),
          duration: gsap.utils.random(0.8,  3.0),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: gsap.utils.random(0, 4),
        });
      });

      // Slowly rotate dashed rings
      gsap.to('.hero-ring-a', { rotation: 360,  duration: 28, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('.hero-ring-b', { rotation: -360, duration: 42, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
      gsap.to('.hero-ring-c', { rotation: 360,  duration: 60, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

      // Shooting stars
      gsap.utils.toArray('.hero-shoot', particlesRef.current).forEach((el, i) => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(7, 14), delay: i * 4 + 1 });
        tl.fromTo(el,
          { x: -220, opacity: 0 },
          { x: vw + 220, opacity: 1, duration: 0.55, ease: 'power2.out' }
        ).to(el, { opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.25');
      });

    }, particlesRef);
    return () => ctx.revert();
  }, []);

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-screen min-h-[620px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${slide.id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt="" fill className={`object-cover ${slide.imagePos}`} priority sizes="100vw" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* GSAP star field: twinkling stars + rotating rings + shooting stars */}
      <div ref={particlesRef} className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">

        {/* Twinkling star dots */}
        {STARS.map(s => (
          <div
            key={s.id}
            className="hero-star absolute rounded-full bg-white"
            style={{
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              opacity: 0.3,
              boxShadow: s.glow ? `0 0 ${s.size + 4}px ${s.size + 2}px rgba(255,255,255,0.45)` : 'none',
            }}
          />
        ))}

        {/* Rotating dashed rings */}
        <div className="hero-ring-a absolute rounded-full" style={{ width: 520, height: 520, top: '2%',  right: '-12%', border: '1px dashed rgba(255,255,255,0.18)' }} />
        <div className="hero-ring-b absolute rounded-full" style={{ width: 360, height: 360, bottom: '-8%', left: '52%',  border: '1px dashed rgba(255,255,255,0.13)' }} />
        <div className="hero-ring-c absolute rounded-full" style={{ width: 760, height: 760, top: '-25%', right: '-22%', border: '1px dashed rgba(255,255,255,0.08)' }} />

        {/* Shooting stars */}
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="hero-shoot absolute"
            style={{
              top:    `${18 + i * 26}%`,
              left:   0,
              width:  130 + i * 35,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(255,255,255,0.4), transparent)',
              opacity: 0,
              transform: 'rotate(-12deg)',
              transformOrigin: 'left center',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pt-20 pb-28">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              {/* Category pill */}
              <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 border backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 ${slide.pill.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${slide.pill.dot}`} />
                <span className={`text-xs font-bold uppercase tracking-widest ${slide.pill.text}`}>{slide.pill.label}</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={headVariants} className="font-black text-white tracking-tighter leading-[0.9] mb-5" style={{ fontSize: 'clamp(2.2rem,5vw,4.4rem)' }}>
                {slide.headline}
                <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accentColor}`}>
                  {slide.accent}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p variants={itemVariants} className="text-gray-100/90 text-base leading-relaxed max-w-xl mb-8">{slide.sub}</motion.p>

              {/* Mini stats strip */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-8">
                {slide.stats.map(({ Icon, value, label }, i) => (
                  <motion.div
                    key={label}
                    custom={i}
                    variants={statVariants}
                    className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5 hover:border-white/25 transition-colors"
                  >
                    <Icon className="text-white/50 text-sm shrink-0" />
                    <div>
                      <p className="text-white font-black text-sm leading-none">{value}</p>
                      <p className="text-gray-300 text-[10px] mt-0.5">{label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                <Link
                  href={slide.href}
                  className={`group inline-flex items-center gap-2.5 ${slide.ctaStyle} text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-xl hover:-translate-y-1 text-sm`}
                >
                  {slide.cta}
                  <FaArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="mailto:info@buyresearchchems.com"
                  className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/15 backdrop-blur-sm border border-white/15 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all hover:-translate-y-1 text-sm"
                >
                  Contact Us
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Bottom control bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-[2px] bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-white/40 to-white/60" style={{ width: `${progress}%` }} />
        </div>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Slide dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
          {/* Slide label */}
          <p className="text-white/30 text-xs font-mono hidden sm:block">
            <span className="text-white/70 font-bold">0{current + 1}</span> / 0{slides.length}
          </p>
          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button onClick={prev} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/20 border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-sm">
              <FaArrowLeft size={11} />
            </button>
            <button onClick={next} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/20 border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-sm">
              <FaArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
