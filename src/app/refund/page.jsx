import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com'),
  title: 'Return & Refund Policy | BuyResearchChems',
  description: 'Learn about our return policy, refund process, and how to request returns for defective or incorrect products.',
  alternates: { canonical: '/refund' },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-14 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Refund Policy</span>
          </nav>
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Returns &amp; Refunds</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Fair, transparent refund policy.
          </h1>
          <p className="text-gray-900 text-base leading-relaxed max-w-xl">
            Due to the nature of research chemicals, all sales are final unless the product is defective, damaged, or incorrect. Claims are processed within 7 business days.
          </p>
          <p className="text-gray-400 text-xs mt-4">Last updated: December 3, 2025</p>
        </div>
      </section>

      {/* Quick reference strip */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-8 max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaCheckCircle className="text-emerald-500 text-sm" />
              <h3 className="text-gray-900 font-bold text-sm">Eligible for Return</h3>
            </div>
            <ul className="text-sm text-gray-900 space-y-1.5">
              {['Defective products', 'Damaged during shipping', 'Wrong items received', 'Missing items from order'].map(item => (
                <li key={item} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-2" />{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaTimesCircle className="text-red-400 text-sm" />
              <h3 className="text-gray-900 font-bold text-sm">NOT Eligible</h3>
            </div>
            <ul className="text-sm text-gray-900 space-y-1.5">
              {['Opened or used products', 'Change of mind', 'Customer ordering error', 'Past return window'].map(item => (
                <li key={item} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-red-400 shrink-0 mt-2" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Main content */}
      <article className="container mx-auto px-6 py-16 max-w-3xl space-y-14 text-gray-900 text-[15px] leading-relaxed">

        {/* 1 — Eligibility */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">1. Return Eligibility</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Acceptable Return Reasons</h3>
          <p className="mb-4">We accept returns ONLY in the following circumstances:</p>
          <div className="space-y-3 mb-8">
            {[
              { title: 'Defective Products', desc: 'Damaged, contaminated, or below quality standards', window: '48 hours' },
              { title: 'Shipping Damage', desc: 'Visible packaging damage during transit', window: '24 hours (with photos)' },
              { title: 'Wrong Items Shipped', desc: 'You received a different product than ordered', window: '48 hours' },
              { title: 'Missing Items', desc: 'Items listed on your order are missing', window: '48 hours' },
            ].map(({ title, desc, window }) => (
              <div key={title} className="flex gap-4 border border-gray-200 rounded-xl p-4">
                <span className="w-1.5 rounded-full bg-emerald-400 shrink-0 self-stretch" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-sm">{desc}</p>
                  <p className="text-xs text-gray-400 mt-1">Report within {window} of delivery</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Non-Returnable Items</h3>
          <ul className="space-y-2 ml-1">
            {[
              ['Opened or Used Products', 'Cannot be returned for safety and legal reasons'],
              ['Change of Mind', 'We do not accept returns due to buyer\'s remorse'],
              ['Customer Error', 'Wrong product ordered by customer'],
              ['Expired Return Window', 'Must be requested within the specified timeframe'],
              ['Improperly Stored Products', 'Damage due to improper handling by customer'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <FaTimesCircle className="text-red-400 text-xs shrink-0 mt-1.5" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2 — Process */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">2. Return Process</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-3">How to Request a Return</h3>
          <div className="space-y-4 mb-8">
            {[
              { title: 'Contact Us Immediately', desc: 'Email info@buyresearchchems.com with your order number, product name, and reason.' },
              { title: 'Provide Evidence', desc: 'Take clear photos of the product, packaging, and any damage.' },
              { title: 'Wait for Approval', desc: 'Our team reviews your request within 24-48 hours.' },
              { title: 'Receive Return Authorization', desc: 'If approved, you get an RA number. Do NOT return items without one.' },
              { title: 'Ship the Product Back', desc: 'Package securely with RA number. Use trackable shipping.' },
              { title: 'Receive Refund or Replacement', desc: 'Once inspected, we process your refund within 7-14 business days.' },
            ].map(({ title, desc }, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-sky-500 font-black text-sm mt-0.5 w-5 shrink-0">0{i + 1}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Return Shipping</h3>
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
              <strong>Our Error:</strong> We provide a prepaid return label. No cost to you.
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
              <strong>Customer Error / Change of Mind:</strong> Returns not accepted. All sales are final.
            </div>
          </div>
        </section>

        {/* 3 — Refund Policy */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">3. Refund Policy</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Refund Methods</h3>
          <div className="space-y-3 mb-6">
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="font-bold text-gray-900 text-sm mb-1">Original Payment Method</p>
              <p className="text-sm mb-2">Refunds go to the original payment method used.</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                <span>Credit/Debit: 5-10 days</span>
                <span>Bank Transfer: 7-14 days</span>
                <span>Other: Up to 14 days</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="font-bold text-gray-900 text-sm mb-1">Store Credit (Optional)</p>
              <p className="text-sm">Choose store credit for an instant 10% bonus (e.g. &euro;100 refund = &euro;110 credit). No expiration.</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">What&apos;s Refunded</h3>
          <ul className="space-y-2 ml-1 mb-6">
            {[
              [true, 'Product Price', 'Full refund of the product price'],
              [true, 'Shipping Fees (Our Error)', 'Original shipping fees refunded if the error was ours'],
              [false, 'Shipping Fees (Customer Error)', 'Non-refundable for customer errors'],
              [false, 'Return Shipping Costs', 'Deducted from refund if customer is responsible'],
            ].map(([ok, t, d]) => (
              <li key={t} className="flex gap-3">
                {ok ? <FaCheckCircle className="text-emerald-500 text-xs shrink-0 mt-1.5" /> : <FaTimesCircle className="text-red-400 text-xs shrink-0 mt-1.5" />}
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Partial Refunds</h3>
          <p className="mb-3">In some cases, we may issue a partial refund:</p>
          <ul className="space-y-2 ml-1">
            {[
              'Products returned without original packaging',
              'Minor defects that don\'t affect research use',
              'Returns after the standard window (case-by-case)',
              'Missing accessories or documentation',
            ].map(item => (
              <li key={item} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4 — Replacements */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">4. Replacement Policy</h2>
          <p className="mb-4">We offer replacements for defective, wrong, damaged, or missing items (subject to availability).</p>
          <div className="space-y-3 mb-4">
            {[
              'Request return authorization as described above',
              'Indicate you prefer a replacement instead of refund',
              'We check product availability',
              'If available, replacement ships within 2-3 business days',
              'If unavailable, we offer a full refund or alternative product',
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-sky-500 font-black text-sm mt-0.5 w-5 shrink-0">0{i + 1}</span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-700">
            <strong>Note:</strong> Replacements are subject to stock. If the product is unavailable, we&apos;ll offer a full refund or equivalent alternative.
          </div>
        </section>

        {/* 5 — Damaged/Defective */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">5. Damaged or Defective Products</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-700">
            <strong>Important:</strong> Inspect your package immediately upon delivery. Report any damage within 24 hours with photos.
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Required Documentation</h3>
          <ul className="space-y-2 ml-1">
            {[
              ['Clear Photos', 'Multiple angles of the product and packaging'],
              ['Product Label', 'Visible product information and batch number'],
              ['Packaging Damage', 'Photos of any external damage'],
              ['Defect Details', 'Clear description of the defect'],
              ['Order Information', 'Order number and date of delivery'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                <span><strong>{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6 — Cancellations */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">6. Order Cancellations</h2>
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
              <strong>Before Shipment:</strong> You may cancel for a full refund if the order hasn&apos;t shipped. Contact us immediately with your order number.
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
              <strong>After Shipment:</strong> Cannot be cancelled. You must follow the return process (subject to our return policy).
            </div>
          </div>
        </section>

        {/* 7 — Chargebacks */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">7. Chargebacks &amp; Disputes</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            <p className="font-bold mb-2">Important Chargeback Policy</p>
            <p className="mb-3">Filing a chargeback without first contacting us is considered fraud and may result in:</p>
            <ul className="space-y-1.5 ml-1 mb-3">
              {['Immediate account termination', 'Blacklisting from future purchases', 'Legal action to recover costs', 'Reporting to fraud prevention agencies'].map(item => (
                <li key={item} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-amber-500 shrink-0 mt-2" />{item}</li>
              ))}
            </ul>
            <p className="font-bold">Please contact us first at <a href="mailto:info@buyresearchchems.com" className="text-sky-500 hover:underline">info@buyresearchchems.com</a>.</p>
          </div>
        </section>

        {/* 8 — Contact */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">8. Contact Us for Returns</h2>
          <p className="mb-5">Have questions or need to start a return?</p>
          <div className="border border-gray-200 rounded-xl p-5 space-y-2 text-sm mb-6">
            <p><strong>Email:</strong> <a href="mailto:info@buyresearchchems.com" className="text-sky-500 hover:underline">info@buyresearchchems.com</a></p>
            <p><strong>Subject Line:</strong> Return Request - Order #[Your Order Number]</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
            <p><strong>Contact Form:</strong> <Link href="/contact" className="text-sky-500 hover:underline">Click here</Link></p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-sm">
            <p className="font-bold mb-2">Include in Your Email:</p>
            <ul className="space-y-1.5 ml-1">
              {['Order number', 'Product name and quantity', 'Reason for return', 'Photos of product/damage (if applicable)', 'Preferred resolution (refund or replacement)'].map(item => (
                <li key={item} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-gray-50 border border-gray-100 rounded-xl p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Quick Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-bold text-gray-900 mb-2">Return Window</p>
              <ul className="space-y-1">
                <li className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />Defective: 48 hours</li>
                <li className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />Damaged: 24 hours</li>
                <li className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />Wrong item: 48 hours</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2">Refund Time</p>
              <ul className="space-y-1">
                <li className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />Processing: 7-14 days</li>
                <li className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />Credit card: 5-10 days</li>
                <li className="flex gap-2"><span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-2" />Bank transfer: 7-14 days</li>
              </ul>
            </div>
          </div>
        </section>
      </article>

      {/* Navigation */}
      <div className="container mx-auto px-6 pb-16 max-w-3xl flex justify-between">
        <Link href="/shipping" className="text-sm font-bold text-gray-900 hover:text-sky-500 transition-colors">&larr; Shipping Policy</Link>
        <Link href="/" className="text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl transition-colors">Back to Home</Link>
      </div>
    </div>
  );
}
