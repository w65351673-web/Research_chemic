'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-36 pb-20 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-900 mb-10">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">About</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em] mb-4">About Us</p>
            <h1 className="font-black text-gray-900 tracking-tight leading-[1.05] mb-6 text-4xl md:text-5xl">
              We help researchers access the compounds they need reliably, discreetly, and fast.
            </h1>
            <p className="text-gray-900 text-lg leading-relaxed">
              BuyResearchChems is a specialist supplier of high purity research chemicals. We serve scientists, laboratory professionals and academic researchers across more than 50 countries, providing analytically verified compounds with a full Certificate of Analysis on every order.
            </p>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Stats strip â”€â”€ */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-10 max-w-3xl">
          <div className="flex flex-wrap justify-between gap-y-6 gap-x-10">
            {[
              ['500+', 'Verified compounds'],
              ['99.9%', 'Average purity'],
              ['10K+', 'Researchers served'],
              ['48h', 'Dispatch time'],
            ].map(([val, label]) => (
              <FadeUp key={label}>
                <div>
                  <p className="text-3xl font-black text-gray-900 leading-none">{val}</p>
                  <p className="text-gray-900 text-sm mt-1">{label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Story â”€â”€ */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <FadeUp>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-6">Our story</h2>
          <div className="space-y-5 text-gray-900 leading-relaxed">
            <p>
              BuyResearchChems was founded on a simple premise: researchers shouldn't have to compromise on compound quality or spend weeks waiting for supply. We set out to build a service that pairs laboratory-grade chemicals with the speed and reliability that modern science demands.
            </p>
            <p>
              Today our catalog spans <strong className="text-gray-900">synthetic cannabinoids, opioids, nitazenes, etomidate</strong> and a growing range of novel research chemicals. Every item we stock undergoes independent analytical verification before it's listed, and every shipment leaves with a Certificate of Analysis attached.
            </p>
            <p>
              Our team is made up of chemistry professionals and logistics specialists who understand what it means to run a time-sensitive research programme. We keep compounds stored in ISO-compliant conditions, dispatch within 48 hours, and ship discreetly to over 50 countries.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* â”€â”€ Image break â”€â”€ */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <Image src="/images/Laboratory-Science.jpg" alt="Laboratory" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-sky-900/30" />
      </section>

      {/* â”€â”€ What we stand for â”€â”€ */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <FadeUp>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-6">What we stand for</h2>
        </FadeUp>

        <div className="space-y-10">
          {[
            {
              title: 'Uncompromising purity',
              text: 'Every compound is independently verified by accredited laboratories before it enters our supply chain. We publish batch purity data and include a full COA with every order â€” no exceptions.',
            },
            {
              title: 'Discreet and secure delivery',
              text: 'Orders are packaged in plain, unmarked parcels with no external branding. Transactions are processed through industry-standard encryption. We never share or sell customer data.',
            },
            {
              title: 'Worldwide reach, local speed',
              text: 'Express and standard courier options to most countries. Every shipment includes tracking from door to door. Our average dispatch time is under 48 hours from confirmation.',
            },
            {
              title: 'Dedicated research support',
              text: 'Our support team is staffed by people who understand chemistry. Whether you need help choosing a compound, interpreting a COA, or resolving a shipping issue, we respond quickly and knowledgeably.',
            },
            {
              title: 'Expanding catalog',
              text: 'We regularly source and verify newly available research-grade compounds. Our goal is to be the single supplier a researcher needs â€” whatever the project demands.',
            },
            {
              title: 'Fair dispute resolution',
              text: 'If something goes wrong, we fix it. Claims and refunds are processed within 7 business days. No automated runaround, no lengthy disputes.',
            },
          ].map(({ title, text }, i) => (
            <FadeUp key={title} delay={i * 0.04}>
              <div className="flex gap-4">
                <span className="w-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5 self-stretch" />
                <div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">{title}</h3>
                  <p className="text-gray-900 leading-relaxed">{text}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* â”€â”€ Commitments â€” simple numbered list â”€â”€ */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 py-20 max-w-3xl">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-10">Our four promises</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {[
              ['ISO-compliant storage', 'All compounds stored in controlled conditions with strict handling protocols.'],
              ['No substitutions â€” ever', 'You receive exactly what you order, every time. No silent swaps.'],
              ['48-hour dispatch', 'Orders are processed and dispatched within two business days of confirmation.'],
              ['Plain packaging worldwide', 'Discreet, unmarked parcels on every shipment, to every destination.'],
            ].map(([title, desc], i) => (
              <FadeUp key={title} delay={i * 0.06}>
                <div className="flex gap-3">
                  <span className="text-sky-400 font-black text-lg leading-none mt-0.5">0{i + 1}</span>
                  <div>
                    <h3 className="text-gray-900 font-bold text-sm mb-1">{title}</h3>
                    <p className="text-gray-900 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€ */}
      <section className="container mx-auto px-6 py-20 max-w-3xl text-center">
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Ready to get started?</h2>
          <p className="text-gray-900 max-w-lg mx-auto mb-8 leading-relaxed">
            Browse our full catalog of verified research compounds. Every listing includes compound specifications, purity grade, and real-time availability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products" className="group inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 text-sm shadow-lg shadow-sky-500/20">
              Browse Products <HiOutlineArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-gray-300 text-gray-900 hover:text-sky-600 hover:border-sky-400 font-bold px-8 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 text-sm">
              Contact Us
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
