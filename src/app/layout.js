import { Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import VisitorTracker from "@/components/tracking/VisitorTracker";
import WhatsAppButton from "@/components/common/WhatsAppButton";

// Providers
import AuthProvider from "@/components/auth/AuthProvider";
import CartProvider from "@/components/cart/CartProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BuyResearchChems | Premium Research Chemicals',
    template: '%s | BuyResearchChems',
  },
  description: 'Buy premium research chemicals online. BuyResearchChems supplies synthetic cannabinoids, opioids, nitazenes and laboratory-grade compounds with worldwide discreet shipping.',
  keywords: [
    'research chemicals', 'buy research chemicals online',
    'synthetic cannabinoids', 'opioids', 'nitazenes', 'laboratory chemicals',
    '5cl-adba', '5cladba', '5fadb', 'jwh-018', 'adb-butinaca', 'ab-pinaca',
    '5F-EDMB-PINACA', 'ADB-FUBINACA', '4FADB', 'AMB-FUBINACA', 'MDMB-4en-PINACA',
    'BuyResearchChems',
  ],
  other: { 'theme-color': '#0ea5e9' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'BuyResearchChems',
    title: 'BuyResearchChems | Premium Research Chemicals',
    description: 'Premium synthetic cannabinoids, opioids, nitazenes and laboratory compounds. Worldwide discreet shipping.',
    images: [
      {
        url: `${BASE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'BuyResearchChems — Premium Research Chemicals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuyResearchChems | Premium Research Chemicals',
    description: 'Premium synthetic cannabinoids, opioids, nitazenes and laboratory compounds. Worldwide discreet shipping.',
    images: [`${BASE_URL}/images/logo.png`],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/favicon.svg',
  },
  verification: {
    // google: 'your-google-site-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${spaceGrotesk.className} font-sans min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-sky-500 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <CartProvider>
            <VisitorTracker />
            <Toaster position="top-center" />
            <WhatsAppButton />
            <ConditionalNavbar>
              <Navbar />
            </ConditionalNavbar>
            <main id="main-content" className="flex-grow">{children}</main>
            <ConditionalNavbar>
              <Footer />
            </ConditionalNavbar>
          </CartProvider>
        </AuthProvider>

        {/* Live Chat — add Tawk.to / Intercom widget ID here */}
      </body>
    </html>
  );
}
