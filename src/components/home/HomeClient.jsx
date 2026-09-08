'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { FaFlask, FaShoppingCart, FaStar, FaTruck, FaCheckCircle, FaQuoteLeft, FaBoxOpen, FaMicroscope, FaAtom, FaCannabis, FaEye, FaLeaf } from 'react-icons/fa';
import { HiOutlineArrowRight as HiArrowRight } from 'react-icons/hi';
import { useCart } from '@/components/cart/CartProvider';
import SEOKeywords from '@/components/seo/SEOKeywords';
import HeroCarousel from '@/components/home/HeroCarousel';

export default function HomeClient({ featuredProducts = [] }) {
  return (
    <div className="min-h-screen bg-white">
      <SEOKeywords />
      <HeroCarousel />
      <HeroDivider />
      <FeaturedProductsSection products={featuredProducts} />
      <HowItWorksSection />
      <QualityBanner />
      <TestimonialsSection />
      <CTABanner />
    </div>
  );
}

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

/* -- Hero Divider Ticker -- */
const TICKER_ITEMS = [
  '? 99.9% Average Purity', '? COA With Every Order', '? 500+ Verified Compounds',
  '? 50+ Countries Delivered', '? 48h Dispatch', '? 10K+ Researchers',
  '? ISO-Compliant Storage', '? Discreet Packaging',
];

function HeroDivider() {
  return (
    <>
      <style>{`@keyframes synthaTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.syntha-ticker{animation:synthaTicker 32s linear infinite;}`}</style>
      <div className="relative overflow-hidden border-y border-sky-100 bg-sky-50/50">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-sky-50/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-sky-50/50 to-transparent z-10 pointer-events-none" />
        <div className="overflow-hidden py-3.5">
          <div className="syntha-ticker flex gap-10 whitespace-nowrap w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-sky-500/60 text-[11px] font-bold uppercase tracking-[0.2em]">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* -- Featured Products -- */
function ProductCard({ product, addedId, onAddToCart }) {
  return (
    <div className="relative group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-sky-300 transition-all duration-300 hover:shadow-xl hover:shadow-sky-100 flex flex-col h-full">
      {product.countInStock <= 0 && <div className="absolute top-3 left-3 z-10 bg-gray-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Sold Out</div>}
      <Link href={`/products/${product.slug}`} className="relative block h-48 bg-gray-100 overflow-hidden shrink-0">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.src = '/images/Laboratory-Science.jpg'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><FaFlask className="text-gray-900 text-4xl" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sky-500 text-[10px] font-black uppercase tracking-widest">{product.category}</span>
          <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className={`text-[9px] ${n <= Math.round(product.rating||0) ? 'text-amber-400' : 'text-gray-200'}`} />)}</div>
        </div>
        <Link href={`/products/${product.slug}`}><h3 className="text-gray-900 font-bold text-sm leading-snug hover:text-sky-500 transition-colors line-clamp-2 mb-1.5">{product.name}</h3></Link>
        <p className="text-gray-900 text-xs leading-relaxed line-clamp-2 mb-3 flex-1">{product.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xl font-black text-gray-900 leading-none">&#8364;{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</p>
            <p className={`text-[10px] mt-0.5 font-semibold ${product.countInStock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{product.countInStock > 0 ? 'In stock' : 'Out of stock'}</p>
          </div>
          {product.countInStock > 0 ? (
            <motion.button onClick={e => onAddToCart(e, product)} whileTap={{ scale: 0.93 }} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${addedId === product._id ? 'bg-emerald-500 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}>
              {addedId === product._id ? <><FaCheckCircle /> Added</> : <><FaShoppingCart /> Add</>}
            </motion.button>
          ) : (
            <button disabled className="px-3 py-2 rounded-xl text-xs font-black uppercase bg-gray-100 text-gray-900 cursor-not-allowed">Sold Out</button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedProductsSection({ products = [] }) {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1800);
    const button = e.currentTarget;
    const br = button.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const cr = cartIcon.getBoundingClientRect();
      const dot = document.createElement('div');
      dot.style.cssText = `position:fixed;z-index:9999;width:12px;height:12px;border-radius:50%;background:#0ea5e9;pointer-events:none;transition:transform 0.65s cubic-bezier(0.4,0,1,1),opacity 0.65s ease;top:${br.top + br.height / 2}px;left:${br.left + br.width / 2}px;`;
      document.body.appendChild(dot);
      requestAnimationFrame(() => { dot.style.transform = `translate(${cr.left - br.left}px,${cr.top - br.top}px) scale(0.3)`; dot.style.opacity = '0'; });
      setTimeout(() => { dot.remove(); cartIcon.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 300 }); }, 680);
    }
  };

  return (
    <section className="py-20 bg-gray-50/50 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-sky-500 text-xs font-black uppercase tracking-[0.25em] mb-2">&#9670; Products</p>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Featured Products</h2>
              <p className="text-gray-900 text-sm mt-2">Hand-picked high-purity compounds trusted by researchers worldwide.</p>
            </div>
            <Link href="/products" className="flex items-center gap-1.5 text-sky-500 hover:text-sky-600 text-sm font-bold transition-colors shrink-0">View all <HiArrowRight size={14} /></Link>
          </div>
        </FadeUp>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <FadeUp key={product._id} delay={i * 0.05}>
                <ProductCard product={product} addedId={addedId} onAddToCart={handleAddToCart} />
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-900"><FaFlask className="text-5xl mx-auto mb-4 opacity-20" /><p className="text-sm">No featured products at the moment.</p></div>
        )}
      </div>
    </section>
  );
}

/* -- How It Works -- */
const steps = [
  { n: '01', Icon: FaBoxOpen, title: 'Browse & Order', desc: 'Explore 500+ verified compounds. Add to cart and checkout with secure encrypted payment in minutes.' },
  { n: '02', Icon: FaMicroscope, title: 'Lab Verified', desc: 'Every compound is independently tested. Your COA is attached automatically to your order confirmation.' },
  { n: '03', Icon: FaTruck, title: 'Discreet Delivery', desc: 'Orders dispatched within 48h in plain unmarked packaging. Full tracking provided at every step.' },
];

function HowItWorksSection() {
  return (
    <section className="py-24 bg-white border-t border-gray-200">
      <div className="container mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <p className="text-sky-500 text-xs font-black uppercase tracking-[0.25em] mb-3">&#9670; Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">How It Works</h2>
            <p className="text-gray-900 text-sm mt-2">Three simple steps from order to delivery.</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ n, Icon, title, desc }, i) => (
            <FadeUp key={n} delay={i * 0.1}>
              <div className="relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-sky-300 transition-all group text-center shadow-sm hover:shadow-md">
                <div className="absolute top-5 right-5 text-6xl font-black text-sky-50 leading-none select-none">{n}</div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 mb-5 group-hover:bg-sky-100 transition-colors">
                  <Icon className="text-sky-500 text-xl" />
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2 tracking-tight">{title}</h3>
                <p className="text-gray-900 text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -- Quality Banner -- */
function QualityBanner() {
  const facts = [
    { Icon: FaAtom, label: '99.9%', sub: 'Average Purity' },
    { Icon: FaEye, label: '500+', sub: 'Verified Compounds' },
    { Icon: FaLeaf, label: '10K+', sub: 'Researchers Served' },
    { Icon: FaCannabis, label: '48h', sub: 'Dispatch Time' },
  ];
  return (
    <section className="border-t border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[340px]">
        <div className="relative min-h-[240px] lg:min-h-auto">
          <Image src="/images/Laboratory-Science.jpg" alt="Laboratory quality" fill className="object-cover object-center" sizes="50vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 hidden lg:block" />
          <div className="absolute inset-0 bg-white/50 lg:hidden" />
          <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <p className="text-gray-900 font-black text-sm">ISO-Compliant Storage</p>
            <p className="text-gray-900 text-xs mt-0.5">All compounds stored to spec</p>
          </div>
        </div>
        <div className="bg-sky-50/50 px-10 py-14 flex flex-col justify-center">
          <FadeUp>
            <p className="text-sky-500 text-xs font-black uppercase tracking-[0.25em] mb-3">&#9670; Our Numbers</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-8">Quality You Can<br />Measure.</h2>
          </FadeUp>
          <div className="grid grid-cols-2 gap-6">
            {facts.map(({ Icon, label, sub }, i) => (
              <FadeUp key={sub} delay={i * 0.08}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                    <Icon className="text-sky-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 leading-none">{label}</p>
                    <p className="text-gray-900 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3}>
            <Link href="/about" className="inline-flex items-center gap-2 mt-8 text-sky-500 hover:text-sky-600 text-sm font-bold transition-colors">
              Learn about our standards <HiArrowRight size={13} />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* -- Testimonials -- */
const testimonials = [
  { text: "BuyResearchChems's quality is unmatched. Their cannabinoids have been instrumental in advancing our research programme.", author: "Dr. J. Smith", role: "Research Scientist", avatar: "J" },
  { text: "Fast shipping, excellent service. Purity consistently exceeds our lab expectations every single time we order.", author: "L. Johnson", role: "Laboratory Director", avatar: "L" },
  { text: "We rely on BuyResearchChems for all our chemical needs. Their quality control processes are genuinely impressive.", author: "M. Williams", role: "Chemical Analyst", avatar: "M" },
  { text: "Their compounds significantly accelerated our development timeline. Consistently high quality and reliability.", author: "Dr. A. Rodriguez", role: "Pharmaceutical Researcher", avatar: "A" },
  { text: "Exceptional results on every order. BuyResearchChems is our trusted, go-to supplier for all laboratory needs.", author: "K. Chen", role: "Lab Manager", avatar: "K" },
  { text: "Professional grade COA on every product. Prompt support and discreet packaging ï¿½ exactly what we need.", author: "T. Okafor", role: "Independent Researcher", avatar: "T" },
];

function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50/50 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <p className="text-sky-500 text-xs font-black uppercase tracking-[0.25em] mb-3">&#9670; Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">What Researchers Say</h2>
            <p className="text-gray-900 mt-2 text-sm">Trusted by scientists, labs and researchers across the globe.</p>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ text, author, role, avatar }, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="bg-white border border-gray-200 rounded-3xl p-7 hover:border-sky-300 transition-all h-full flex flex-col justify-between shadow-sm hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <FaStar key={n} className="text-amber-400 text-xs" />)}</div>
                    <FaQuoteLeft className="text-sky-200 text-xl" />
                  </div>
                  <p className="text-gray-900 text-sm leading-relaxed">{text}</p>
                </div>
                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-black text-sm shrink-0">{avatar}</div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm leading-tight">{author}</p>
                    <p className="text-sky-500 text-xs font-medium">{role}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -- CTA Banner -- */
function CTABanner() {
  return (
    <section className="relative overflow-hidden border-t border-gray-200">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        <FadeUp>
          <p className="text-sky-200 text-xs font-black uppercase tracking-[0.3em] mb-4">&#9670; Get Started Today</p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-5">Elevate Your<br />Research.</h2>
          <p className="text-sky-100 text-base max-w-xl mx-auto mb-10">Join thousands of scientists who trust BuyResearchChems for premium-grade compounds, reliably sourced and discreetly delivered.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products" className="group inline-flex items-center gap-2.5 bg-white text-sky-700 font-black px-10 py-4 rounded-2xl transition-all hover:bg-sky-50 hover:-translate-y-1 shadow-2xl text-sm">
              Shop Now <HiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="mailto:info@buyresearchchems.com" className="inline-flex items-center gap-2 border border-white/30 text-white hover:text-white hover:border-white/60 font-bold px-10 py-4 rounded-2xl transition-all hover:-translate-y-1 text-sm">Contact Us</a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
