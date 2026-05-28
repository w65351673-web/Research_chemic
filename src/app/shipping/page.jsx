import Link from 'next/link';
import { FaShippingFast, FaGlobeAmericas, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com'),
  title: 'Shipping & Delivery Policy | BuyResearchChems',
  description: 'Learn about our shipping methods, delivery times, international shipping, and tracking information.',
  alternates: { canonical: '/shipping' },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-14 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Shipping</span>
          </nav>
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Shipping &amp; Delivery</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Fast, discreet delivery to your door.
          </h1>
          <p className="text-gray-900 text-base leading-relaxed max-w-xl">
            Every order is dispatched within 48 hours in plain, unmarked packaging. We ship to 50+ countries with full tracking on every parcel.
          </p>
          <p className="text-gray-400 text-xs mt-4">Last updated: December 3, 2025</p>
        </div>
      </section>

      {/* Highlights strip */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-8 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { Icon: FaShippingFast, title: '48h Dispatch', desc: 'Orders processed within 24-48 hours' },
              { Icon: FaShieldAlt, title: 'Discreet Packaging', desc: 'Unmarked, tamper-evident parcels' },
              { Icon: FaGlobeAmericas, title: 'Worldwide Reach', desc: 'Standard & express to 50+ countries' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="text-sky-500 text-sm" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{title}</p>
                  <p className="text-gray-900 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <article className="container mx-auto px-6 py-16 max-w-3xl space-y-14 text-gray-900 text-[15px] leading-relaxed">

        {/* 1 — Processing */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">1. Order Processing Time</h2>
          <p className="mb-4">All orders are carefully processed and prepared for shipment by our team:</p>
          <ul className="space-y-2 ml-1">
            {[
              ['Standard Processing', '24-48 hours (Monday-Friday)'],
              ['Weekend Orders', 'Processed on the next business day'],
              ['Holiday Orders', 'May experience delays during major holidays'],
              ['Verification Required', 'Orders requiring additional verification may take 2-3 business days'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mt-5 text-sm text-sky-700">
            <strong>Tip:</strong> Orders placed before 2:00 PM (CET) Monday-Friday are typically processed the same day.
          </div>
        </section>

        {/* 2 — Methods & Times */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">2. Shipping Methods &amp; Delivery Times</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Domestic Shipping</h3>
          <div className="space-y-3 mb-6">
            {[
              { method: 'Standard Shipping', price: '15.00', time: '3-5 business days', note: 'Reliable and cost-effective' },
              { method: 'Express Shipping', price: '35.00', time: '1-2 business days', note: 'Priority handling' },
            ].map(({ method, price, time, note }) => (
              <div key={method} className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{method}</p>
                  <p className="text-gray-900 text-xs">{time} — {note}</p>
                </div>
                <span className="text-sky-500 font-black text-sm">&euro;{price}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 text-emerald-700 text-sm font-bold">
              <FaCheckCircle className="text-xs" /> FREE standard shipping on orders over &euro;100
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">International Shipping</h3>
          <div className="space-y-3">
            {[
              { region: 'Europe (EU)', price: '25.00', time: '5-10 business days' },
              { region: 'North America', price: '45.00', time: '7-14 business days' },
              { region: 'Rest of World', price: '60.00', time: '10-21 business days' },
            ].map(({ region, price, time }) => (
              <div key={region} className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4">
                <div>
                  <p className="text-gray-900 font-bold text-sm">{region}</p>
                  <p className="text-gray-900 text-xs">{time}</p>
                </div>
                <span className="text-sky-500 font-black text-sm">&euro;{price}</span>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5 text-sm text-amber-700">
            <strong>Note:</strong> Delivery times are estimates and may vary due to customs processing, weather, or carrier delays.
          </div>
        </section>

        {/* 3 — Packaging */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">3. Discreet &amp; Secure Packaging</h2>
          <p className="mb-4">We understand the importance of privacy. All orders are shipped with the utmost discretion:</p>
          <ul className="space-y-2 ml-1">
            {[
              ['Unmarked Packaging', 'Plain, neutral boxes or envelopes with no branding'],
              ['Generic Sender Name', 'No mention of "BuyResearchChems" on the package'],
              ['Secure Sealing', 'Tamper-evident packaging to ensure product integrity'],
              ['Proper Cushioning', 'Products are carefully packed to prevent damage'],
              ['Confidential Labels', 'No product descriptions on shipping labels'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mt-5 text-sm text-sky-700">
            <strong>Privacy Guarantee:</strong> Your order details remain completely confidential. We never share shipping information with third parties except as required for delivery.
          </div>
        </section>

        {/* 4 — Tracking */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">4. Order Tracking</h2>
          <p className="mb-4">Once your order ships, you will receive:</p>
          <ul className="space-y-2 ml-1 mb-6">
            {[
              'Shipping confirmation email within 24 hours of shipment',
              'Unique tracking number for your order',
              'Name of the shipping carrier',
              'Estimated delivery timeframe',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-3">How to Track Your Order</h3>
          <div className="space-y-4">
            {[
              ['Check your email', 'Look for the shipping confirmation from info@buyresearchchems.com'],
              ['Visit carrier website', 'Click the tracking link or visit the carrier site directly'],
              ['Enter tracking number', 'Input your unique code to see real-time updates'],
              ['Monitor progress', 'Check regularly for status updates until delivery'],
            ].map(([title, desc], i) => (
              <div key={i} className="flex gap-4">
                <span className="text-sky-500 font-black text-sm mt-0.5">0{i + 1}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-900 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mt-5 text-sm text-sky-700">
            <strong>Tip:</strong> Tracking information may take 24-48 hours to become active after shipment.
          </div>
        </section>

        {/* 5 — International */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">5. International Shipping Information</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Customs &amp; Duties</h3>
          <ul className="space-y-2 ml-1 mb-6">
            {[
              ['Customs Fees', 'You are responsible for all customs duties, taxes, and fees'],
              ['Import Regulations', 'Ensure products are legal to import in your country'],
              ['Customs Delays', 'Packages may be held for inspection, causing delays'],
              ['Refused Shipments', 'We cannot refund orders refused due to customs issues'],
              ['Declaration Value', 'We declare the actual product value on customs forms'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>

          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-700 mb-6">
            <strong>Shipping Restrictions:</strong> Please contact us at{' '}
            <a href="mailto:info@buyresearchchems.com" className="underline">info@buyresearchchems.com</a>{' '}
            to verify if we can ship to your country before placing an order.
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Address Requirements</h3>
          <ul className="space-y-2 ml-1">
            {[
              'Provide complete and accurate address including postal code',
              'Include phone number for customs clearance',
              'Use English characters for address (if applicable)',
              'Specify any special delivery instructions',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6 — Delivery Issues */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">6. Delivery Issues</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Lost or Stolen Packages</h3>
          <p className="mb-3">If your package is marked as delivered but you haven&apos;t received it:</p>
          <ol className="space-y-2 ml-1 mb-4 list-decimal list-inside">
            <li>Check with neighbors, building management, or household members</li>
            <li>Look for delivery notices or alternative drop-off locations</li>
            <li>Wait 24 hours as carriers sometimes mark packages delivered early</li>
            <li>Contact the shipping carrier directly with your tracking number</li>
            <li>If still missing after 48 hours, contact us at <a href="mailto:info@buyresearchchems.com" className="text-sky-500 hover:underline">info@buyresearchchems.com</a></li>
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-6">
            <strong>Note:</strong> We are not responsible for packages stolen after delivery confirmation. Consider using a secure delivery location.
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Damaged Packages</h3>
          <ul className="space-y-2 ml-1 mb-6">
            {[
              ['Do Not Open', 'Keep the package sealed if possible'],
              ['Take Photos', 'Document all damage to packaging and contents'],
              ['Contact Us Immediately', 'Email photos within 24 hours'],
              ['File Carrier Claim', 'We will assist with filing a claim'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Wrong or Missing Items</h3>
          <ul className="space-y-2 ml-1">
            {[
              'Contact us within 48 hours of delivery',
              'Provide your order number and photos of received items',
              'We will arrange for replacement or refund',
              'Return shipping will be covered by us for our errors',
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 7 — Restrictions */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">7. Shipping Restrictions</h2>
          <p className="mb-4">Due to the nature of our products, certain restrictions apply:</p>
          <ul className="space-y-2 ml-1">
            {[
              ['Research Use Only', 'Products must be used for legitimate research purposes'],
              ['Legal Compliance', 'You are responsible for ensuring products are legal in your location'],
              ['Age Verification', 'Must be 18+ to receive shipments'],
              ['Signature Required', 'Some orders may require signature upon delivery'],
              ['PO Boxes', 'We do not ship to PO boxes for security reasons'],
              ['Freight Forwarders', 'Use of freight forwarding services is prohibited'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 8 — Support */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">8. Shipping Support</h2>
          <p className="mb-5">Need help with your shipment? We&apos;re here to assist:</p>
          <div className="border border-gray-200 rounded-xl p-5 space-y-2 text-sm mb-6">
            <p><strong>Email:</strong> <a href="mailto:info@buyresearchchems.com" className="text-sky-500 hover:underline">info@buyresearchchems.com</a></p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
            <p><strong>Contact Form:</strong> <Link href="/contact" className="text-sky-500 hover:underline">Click here</Link></p>
            <p className="text-gray-400 text-xs pt-2">Please include your order number and tracking information when contacting us about shipping issues.</p>
          </div>
        </section>

        {/* Tips */}
        <section className="bg-gray-50 border border-gray-100 rounded-xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Shipping Tips</h2>
          <ul className="space-y-2.5">
            {[
              'Double-check your shipping address before completing checkout',
              'Provide a phone number for delivery notifications',
              'Choose a secure delivery location to prevent theft',
              'Track your package regularly for updates',
              'Contact us immediately if you notice any issues',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>

      {/* Navigation */}
      <div className="container mx-auto px-6 pb-16 max-w-3xl flex justify-between">
        <Link href="/terms" className="text-sm font-bold text-gray-900 hover:text-sky-500 transition-colors">&larr; Terms &amp; Conditions</Link>
        <Link href="/" className="text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}
