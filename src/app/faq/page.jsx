'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

function renderAnswerWithLinks(text) {
  const emailRegex = /([\w.-]+@[\w.-]+\.\w+)/g;
  const parts = text.split(emailRegex);
  return parts.map((part, i) =>
    emailRegex.test(part) ? (
      <a key={i} href={`mailto:${part}`} className="text-sky-400 hover:text-sky-300">{part}</a>
    ) : (
      part
    )
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'ðŸ“‹' },
    { id: 'ordering', name: 'Ordering & Payment', icon: 'ðŸ›’' },
    { id: 'shipping', name: 'Shipping & Delivery', icon: 'ðŸ“¦' },
    { id: 'products', name: 'Products & Quality', icon: 'ðŸ§ª' },
    { id: 'account', name: 'Account & Security', icon: 'ðŸ”' },
    { id: 'returns', name: 'Returns & Refunds', icon: 'ðŸ”„' },
  ];

  const faqs = [
    // Ordering & Payment
    {
      category: 'ordering',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfer, cryptocurrency (Bitcoin, Ethereum), and other secure payment options. Contact us at order@researchchems.online after placing your order to receive specific payment instructions for your preferred method.'
    },
    {
      category: 'ordering',
      question: 'How do I pay for my order?',
      answer: 'After adding items to your cart and proceeding to checkout, you\'ll need to contact us at order@researchchems.online for payment instructions. We\'ll respond within 24 hours with detailed instructions for your chosen payment method. Once payment is confirmed, we\'ll process and ship your order.'
    },
    {
      category: 'ordering',
      question: 'Is my payment information secure?',
      answer: 'Yes, absolutely. We use secure payment methods and never store sensitive payment information. All transactions are handled through encrypted channels. Specific security details will be provided when you receive payment instructions.'
    },
    {
      category: 'ordering',
      question: 'Can I cancel my order after placing it?',
      answer: 'You can cancel your order for a full refund only if it hasn\'t been processed or shipped yet. Orders are typically processed within 24-48 hours. Contact us immediately at order@researchchems.online with your order number if you need to cancel.'
    },
    {
      category: 'ordering',
      question: 'Do you offer bulk discounts?',
      answer: 'Yes! We offer volume discounts for bulk orders. Contact us at order@researchchems.online with details about the products and quantities you need, and we\'ll provide a custom quote.'
    },
    {
      category: 'ordering',
      question: 'Why was my order declined?',
      answer: 'Orders may be declined due to: incorrect payment information, insufficient funds, security flags from your bank, or failed verification checks. Contact your bank first, then reach out to us if the issue persists.'
    },

    // Shipping & Delivery
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Domestic orders: 3-5 business days (Standard) or 1-2 days (Express). International orders: 5-21 business days depending on destination. All orders are processed within 24-48 hours on business days.'
    },
    {
      category: 'shipping',
      question: 'Do you offer free shipping?',
      answer: 'Yes! We offer FREE standard shipping on all orders over \u20AC100. For orders under \u20AC100, standard shipping is \u20AC15 within the country.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs vary by destination: Europe (\u20AC25), North America (\u20AC45), Rest of World (\u20AC60). Please note that you are responsible for any customs duties or import taxes.'
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a shipping confirmation email with a tracking number. Click the tracking link or visit the carrier\'s website and enter your tracking number to see real-time updates.'
    },
    {
      category: 'shipping',
      question: 'Is packaging discreet?',
      answer: 'Yes, absolutely. All orders are shipped in plain, unmarked packaging with no mention of BuyResearchChems or product details. The sender name is generic for your privacy.'
    },
    {
      category: 'shipping',
      question: 'What if my package is lost or stolen?',
      answer: 'If your package is marked as delivered but you haven\'t received it, wait 24-48 hours and check with neighbors or building management. If still missing, contact us immediately at order@researchchems.online with your tracking number.'
    },

    // Products & Quality
    {
      category: 'products',
      question: 'Are your products legal?',
      answer: 'Our products are legal research chemicals intended for laboratory and research use only. However, legality varies by country and region. You are responsible for ensuring products are legal to purchase and possess in your jurisdiction.'
    },
    {
      category: 'products',
      question: 'What purity level are your products?',
      answer: 'All our products meet high purity standards, typically 98%+ purity. Each product listing includes detailed specifications. We provide Certificates of Analysis (COA) upon request for verification.'
    },
    {
      category: 'products',
      question: 'Are products tested?',
      answer: 'Yes, all products undergo rigorous quality control testing before being listed for sale. We work with certified laboratories to ensure purity, potency, and safety standards are met.'
    },
    {
      category: 'products',
      question: 'Can I request a Certificate of Analysis (COA)?',
      answer: 'Yes! Contact us at order@researchchems.online with your order number and product name, and we\'ll provide the COA for your batch within 24-48 hours.'
    },
    {
      category: 'products',
      question: 'Are your products for human consumption?',
      answer: 'No. All our products are strictly for research and laboratory use only. They are not intended for human consumption. These are research chemicals for qualified researchers and institutions.'
    },
    {
      category: 'products',
      question: 'How should I store the products?',
      answer: 'Store products in a cool, dry place away from direct sunlight and moisture. Keep in original sealed containers until use. Specific storage requirements are listed on product labels. Always follow proper laboratory safety protocols.'
    },
    {
      category: 'products',
      question: 'Do products have expiration dates?',
      answer: 'Yes, all products have expiration dates printed on the packaging. When stored properly, most products remain stable for 2-3 years. We only ship products with at least 12 months until expiration.'
    },

    // Account & Security
    {
      category: 'account',
      question: 'Do I need an account to order?',
      answer: 'Yes, you must create an account to place orders. This helps us verify customer information, maintain order history, and ensure compliance with regulations.'
    },
    {
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and you\'ll receive a password reset link. If you don\'t receive the email within 10 minutes, check your spam folder or contact support.'
    },
    {
      category: 'account',
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. All personal information is encrypted and stored securely. We never share your information with third parties except as required for order fulfillment. Read our Privacy Policy for details.'
    },
    {
      category: 'account',
      question: 'Can I update my account information?',
      answer: 'Yes, log in to your account and go to "Profile" or "Account Settings" to update your name, email, shipping address, and other information.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'Contact us at order@researchchems.online with your account email and request account deletion. We\'ll process your request within 7 business days. Note that order history may be retained for legal compliance.'
    },

    // Returns & Refunds
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns only for defective, damaged, or incorrect products within 24-48 hours of delivery. Products must be unopened and in original packaging. Contact us immediately with photos for return authorization.'
    },
    {
      category: 'returns',
      question: 'Can I return a product if I change my mind?',
      answer: 'No, we do not accept returns for change of mind or customer error due to the nature of research chemicals. All sales are final unless the product is defective, damaged, or incorrect.'
    },
    {
      category: 'returns',
      question: 'How long do refunds take?',
      answer: 'Once we receive and approve your return, refunds are processed within 7-14 business days. The refund will be issued to your original payment method and may take an additional 5-10 business days to appear in your account.'
    },
    {
      category: 'returns',
      question: 'Who pays for return shipping?',
      answer: 'If the return is due to our error (defective, wrong, or damaged product), we provide a prepaid return label. For other returns (if accepted), you are responsible for return shipping costs.'
    },
    {
      category: 'returns',
      question: 'Can I exchange a product instead of getting a refund?',
      answer: 'Yes, we offer replacements for defective or incorrect products subject to availability. If you prefer an exchange, indicate this when requesting your return authorization.'
    },

    // General
    {
      category: 'ordering',
      question: 'Do you have a minimum order amount?',
      answer: 'No, there is no minimum order amount. However, orders over \u20AC100 qualify for free standard shipping.'
    },
    {
      category: 'products',
      question: 'Are your products in stock?',
      answer: 'Product availability is shown on each product page. If an item is out of stock, you can sign up for restock notifications. We regularly update our inventory.'
    },
    {
      category: 'shipping',
      question: 'Can I change my shipping address after ordering?',
      answer: 'Contact us immediately at order@researchchems.online if you need to change your shipping address. We can only modify the address if the order hasn\'t been shipped yet.'
    },
    {
      category: 'account',
      question: 'Do you offer customer support?',
      answer: 'Yes! Contact us via email at order@researchchems.online, use our contact form, or chat with us using the LiveChat widget. We typically respond within 24 hours.'
    },
    {
      category: 'ordering',
      question: 'Can I order by phone?',
      answer: 'Currently, we only accept orders through our website for security and accuracy. If you need assistance placing an order, contact us at order@researchchems.online and we\'ll guide you through the process.'
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-900 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="text-gray-900">FAQ</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 text-sky-400 text-sm font-medium mb-4">
            <FaQuestionCircle className="text-xs" />
            Support Center
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-900 text-base max-w-xl mx-auto">
            Find answers to common questions about products, ordering, shipping, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 text-xs" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/60 border border-gray-700/50 text-gray-900 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-600 text-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-sky-500 text-gray-900 shadow-lg shadow-sky-800/30'
                    : 'bg-gray-50/60 border border-gray-700/50 text-gray-900 hover:text-gray-900 hover:border-gray-600'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-2">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className={`bg-gray-50/60 border rounded-2xl overflow-hidden transition-all ${
                  openIndex === index ? 'border-sky-500/40' : 'border-gray-700/50 hover:border-gray-600/50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="text-gray-900 font-medium text-sm pr-4 leading-snug">{faq.question}</span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-sky-400 flex-shrink-0 text-xs" />
                  ) : (
                    <FaChevronDown className="text-gray-900 flex-shrink-0 text-xs" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 border-t border-gray-700/40">
                    <p className="text-gray-900 leading-relaxed text-sm pt-4">{renderAnswerWithLinks(faq.answer)}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-900">No questions matched your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 text-sky-400 hover:text-sky-300 text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 bg-gradient-to-br from-sky-800/30 to-gray-900/60 border border-sky-600/30 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-900 text-sm mb-6">Our support team typically responds within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:order@researchchems.online"
              className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-500 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 text-sm">
              Contact Support
            </a>
            <a href="mailto:order@researchchems.online"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-700 border border-gray-700 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
              Email Us
            </a>
          </div>
        </div>

        {/* Policy Quick Links */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms & Conditions' },
            { href: '/shipping', label: 'Shipping Policy' },
            { href: '/refund', label: 'Return & Refund' },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="bg-gray-50/60 border border-gray-700/50 hover:border-sky-500/40 rounded-xl p-3 text-center text-sm text-gray-900 hover:text-sky-400 transition-all">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
