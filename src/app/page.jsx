import Script from 'next/script';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';
import HomeClient from '@/components/home/HomeClient';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/seo/SEOKeywords';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Buy Research Chemicals Online | 5cl-adba, 5fadb, JWH-018 | BuyResearchChems',
  description: 'Buy premium research chemicals online at BuyResearchChems. High-purity synthetic cannabinoids (5cl-adba, 5fadb, jwh-018, adb-butinaca), opioids, nitazenes and lab-grade compounds with discreet worldwide shipping.',
  keywords: [
    'buy research chemicals online',
    'research chemicals for sale',
    'synthetic cannabinoids',
    'buy synthetic cannabinoids',
    '5cl-adba', '5cladba', '5-cl-adba', '5fadb', '5-fadb',
    'jwh-018', 'adb-butinaca', 'ab-pinaca',
    '5F-EDMB-PINACA', 'ADB-FUBINACA', '4FADB', 'AMB-FUBINACA', 'MDMB-4en-PINACA',
    '6cl-adba', '6-cl-adba',
    'opioids', 'nitazenes', 'benzos',
    'isotonitazene', 'metonitazene', 'protonitazene', 'butonitazene',
    'fentanyl', 'morphine sulfate', 'oxycodone', 'hydrocodone', 'codeine phosphate',
    'ketamine', 'alpha-pvp', 'alpha-pihp', '3-cmc', '4-cmc', '3-mmc', '4-mmc',
    'laboratory chemicals', 'premium research chemicals', 'lab verified chemicals',
    'BuyResearchChems',
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'BuyResearchChems',
    title: 'Buy Research Chemicals Online | 5cl-adba, 5fadb, JWH-018 | BuyResearchChems',
    description: 'Premium synthetic cannabinoids, opioids, nitazenes and laboratory compounds. Worldwide discreet shipping. Shop BuyResearchChems today.',
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
    title: 'Buy Research Chemicals Online | BuyResearchChems',
    description: 'Premium synthetic cannabinoids, opioids, nitazenes and laboratory compounds. Worldwide discreet shipping.',
    images: [`${BASE_URL}/images/logo.png`],
  },
};

async function getFeaturedProducts() {
  await dbConnect();
  try {
    const products = await Product.find({ featured: true })
      .limit(12)
      .select('-reviews')
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient featuredProducts={featuredProducts} />
    </>
  );
}
