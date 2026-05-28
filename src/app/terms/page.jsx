import Link from 'next/link';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com'),
  title: 'Terms & Conditions | BuyResearchChems',
  description: 'Terms and Conditions for BuyResearchChems â€" Read our terms of service, user agreements, and legal policies for purchasing research chemicals.',
  alternates: { canonical: '/terms' },
};

const Dot = () => <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-14 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Terms</span>
          </nav>
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Terms &amp; Conditions</h1>
          <p className="text-gray-900 text-base leading-relaxed max-w-xl">
            By using BuyResearchChems you agree to be bound by these terms. Please read them carefully before placing an order.
          </p>
          <p className="text-gray-400 text-xs mt-4">Last updated: December 3, 2025</p>
        </div>
      </section>

      {/* Content */}
      <article className="container mx-auto px-6 py-16 max-w-3xl space-y-14 text-gray-900 text-[15px] leading-relaxed">

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">Welcome to BuyResearchChems. By accessing or using our website, mobile application, or services (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our Services.</p>
          <p className="mb-4">These Terms constitute a legally binding agreement between you and BuyResearchChems.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            <strong>Important:</strong> Our products are intended for research and laboratory use only. Not for human consumption.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">2. Eligibility</h2>
          <p className="mb-4">To use our Services, you must:</p>
          <ul className="space-y-2 ml-1">
            {['Be at least 18 years of age or the age of majority in your jurisdiction','Have the legal capacity to enter into binding contracts','Not be prohibited from using our Services under applicable laws','Be a qualified researcher, laboratory, or institution','Comply with all local, state, national, and international laws'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mt-5 text-sm text-sky-700">
            By using our Services, you represent and warrant that you meet all eligibility requirements.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">3. Account Registration</h2>
          <h3 className="text-lg font-bold mb-3">Account Creation</h3>
          <p className="mb-3">To purchase products, you must create an account. You agree to:</p>
          <ul className="space-y-2 ml-1 mb-6">
            {['Provide accurate, current, and complete information','Maintain and update your information','Keep your password secure and confidential','Notify us immediately of any unauthorized access','Accept responsibility for all activities under your account'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
          <h3 className="text-lg font-bold mb-3">Account Termination</h3>
          <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or any other reason at our sole discretion.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">4. Products and Services</h2>
          <h3 className="text-lg font-bold mb-3">Product Information</h3>
          <p className="mb-6">We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that content is accurate, complete, reliable, current, or error-free.</p>

          <h3 className="text-lg font-bold mb-3">Research Use Only</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-6">
            <p className="font-bold mb-2">All products sold on BuyResearchChems are:</p>
            <ul className="space-y-1 ml-1">
              {['Intended for research and laboratory use ONLY','NOT for human or animal consumption','NOT for medical, therapeutic, or recreational use','To be handled by qualified professionals only','Subject to proper storage and handling requirements'].map(i=><li key={i} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-amber-500 shrink-0 mt-2" />{i}</li>)}
            </ul>
          </div>

          <h3 className="text-lg font-bold mb-3">Pricing</h3>
          <p className="mb-6">All prices are listed in Euros (&euro;) and are subject to change without notice. Prices do not include applicable taxes, duties, or shipping fees unless otherwise stated.</p>

          <h3 className="text-lg font-bold mb-3">Product Availability</h3>
          <p>Product availability is subject to change. We reserve the right to limit quantities, discontinue products, or refuse orders at our discretion.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">5. Orders and Payment</h2>
          <h3 className="text-lg font-bold mb-3">Order Acceptance</h3>
          <p className="mb-6">Your order is an offer to purchase. We reserve the right to accept or reject any order. Order confirmation does not guarantee acceptance.</p>
          <h3 className="text-lg font-bold mb-3">Payment</h3>
          <ul className="space-y-2 ml-1 mb-6">
            {['Payment must be made at the time of order','We accept bank transfer, Bitcoin, Ethereum, and other agreed methods','All payments are processed securely','You authorize us to charge your payment method for the total amount','Payment information must be accurate and current'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
          <h3 className="text-lg font-bold mb-3">Order Verification</h3>
          <p>We may require additional verification, including proof of identity, research credentials, or institutional affiliation.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">6. Shipping and Delivery</h2>
          <ul className="space-y-2 ml-1 mb-4">
            {['Shipping times are estimates and not guaranteed','We are not responsible for delays caused by carriers','Risk of loss passes to you upon delivery to the carrier','You are responsible for accurate shipping information','Additional customs fees or taxes may apply for international orders'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
          <p>All orders are shipped in discreet, unmarked packaging to protect your privacy.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">7. Returns and Refunds</h2>
          <ul className="space-y-2 ml-1 mb-4">
            {[['Defective Products','Must be reported within 48 hours of delivery'],['Wrong Items','Must be reported within 48 hours of delivery'],['Damaged in Transit','Must be reported within 24 hours with photos'],['Non-Returnable','Opened, used, or improperly stored products cannot be returned']].map(([t,d])=><li key={t} className="flex gap-3"><Dot /><span><strong>{t}:</strong> {d}</span></li>)}
          </ul>
          <p className="mb-4">Approved refunds are processed within 7-14 business days to the original payment method. Shipping fees are non-refundable unless the error was ours.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            <strong>Chargebacks:</strong> Initiating a chargeback without contacting us first may result in account termination and legal action.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">8. Prohibited Uses</h2>
          <p className="mb-4">You agree NOT to use our Services to:</p>
          <ul className="space-y-2 ml-1">
            {['Violate any local, state, national, or international law','Purchase products for human or animal consumption','Resell products without authorization','Misrepresent your identity, credentials, or intended use','Engage in fraudulent activities or payment disputes','Attempt to gain unauthorized access to our systems','Interfere with or disrupt our Services','Use automated systems (bots, scrapers) without permission','Collect user information without consent','Post or transmit harmful, illegal, or offensive content'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">9. Intellectual Property</h2>
          <p className="mb-4">All content on our website is owned by or licensed to BuyResearchChems and protected by copyright, trademark, and other IP laws.</p>
          <p className="mb-3">We grant you a limited, non-exclusive, non-transferable license for personal, non-commercial use. You may not:</p>
          <ul className="space-y-2 ml-1">
            {['Reproduce, distribute, or modify our content','Use our trademarks or branding without permission','Create derivative works from our content','Reverse engineer or decompile our software'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">10. Disclaimers and Warranties</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
            <p className="font-bold text-sm mb-3">AS-IS Basis</p>
            <p className="text-sm mb-3">OUR SERVICES AND PRODUCTS ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, INCLUDING:</p>
            <ul className="space-y-1.5 ml-1 text-sm">
              {['Merchantability or fitness for a particular purpose','Accuracy, reliability, or completeness of content','Uninterrupted or error-free operation','Security or freedom from viruses'].map(i=><li key={i} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-gray-400 shrink-0 mt-2" />{i}</li>)}
            </ul>
          </div>
          <p>While we strive to provide high-quality products, we do not guarantee specific results, purity levels, or suitability for your particular research needs.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">11. Limitation of Liability</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="font-bold text-sm mb-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUYRESEARCHCHEMS SHALL NOT BE LIABLE FOR:</p>
            <ul className="space-y-1.5 ml-1 text-sm mb-3">
              {['Indirect, incidental, special, consequential, or punitive damages','Loss of profits, revenue, data, or business opportunities','Personal injury or property damage','Misuse of products or failure to follow safety guidelines','Actions of third parties (shipping carriers, payment processors)','Unauthorized access to your account or information'].map(i=><li key={i} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-gray-400 shrink-0 mt-2" />{i}</li>)}
            </ul>
            <p className="text-sm">Our total liability shall not exceed the amount you paid for the specific product or service giving rise to the claim.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">12. Indemnification</h2>
          <p className="mb-4">You agree to indemnify, defend, and hold harmless BuyResearchChems from any claims, damages, losses, liabilities, and expenses arising from:</p>
          <ul className="space-y-2 ml-1">
            {['Your use or misuse of our Services or products','Violation of these Terms','Violation of any laws or regulations','Infringement of third-party rights','Your negligence or willful misconduct'].map(i=><li key={i} className="flex gap-3"><Dot /><span>{i}</span></li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">13. Dispute Resolution</h2>
          <p className="mb-4">Before filing a claim, you agree to contact us at <a href="mailto:info@buyresearchchems.com" className="text-sky-500 hover:underline">info@buyresearchchems.com</a> to attempt to resolve the dispute informally.</p>
          <p className="mb-4">Disputes that cannot be resolved informally shall be resolved through binding arbitration in accordance with applicable rules.</p>
          <p>You agree to resolve disputes on an individual basis and waive the right to participate in class actions or class arbitrations.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">14. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict of law principles.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">15. Modifications</h2>
          <p>We reserve the right to modify these Terms at any time. Changes are effective immediately upon posting. Your continued use constitutes acceptance of modified Terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">16. Severability</h2>
          <p>If any provision of these Terms is found invalid or unenforceable, the remaining provisions remain in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">17. Entire Agreement</h2>
          <p>These Terms, together with our Privacy Policy and any other legal notices on our website, constitute the entire agreement between you and BuyResearchChems.</p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">18. Contact Us</h2>
          <p className="mb-5">If you have questions about these Terms, please contact us:</p>
          <div className="border border-gray-200 rounded-xl p-5 space-y-2 text-sm">
            <p><strong>Email:</strong> <a href="mailto:info@buyresearchchems.com" className="text-sky-500 hover:underline">info@buyresearchchems.com</a></p>
            <p><strong>Website:</strong> <Link href="/contact" className="text-sky-500 hover:underline">Contact Form</Link></p>
            <p><strong>Response Time:</strong> We aim to respond within 48 hours</p>
          </div>
        </section>

        <section className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-sm">
          <h2 className="text-lg font-black mb-3">Acknowledgment</h2>
          <p className="mb-3">BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.</p>
          <p>You further acknowledge and accept full responsibility for the proper use and handling of all products purchased.</p>
        </section>
      </article>

      {/* Navigation */}
      <div className="container mx-auto px-6 pb-16 max-w-3xl flex justify-between">
        <Link href="/privacy" className="text-sm font-bold text-gray-900 hover:text-sky-500 transition-colors">&larr; Privacy Policy</Link>
        <Link href="/" className="text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}
