// Primary keywords — matches actual products listed on the site
export const primaryKeywords = [
  // Cannabinoids
  '5cl-adba', '5-cl-adba', '5cladba',
  '5fadb', '5-fadb',
  '6cl-adba', '6-cl-adba',
  'jwh-018',
  'adb-butinaca',
  // Opioids
  'morphine sulfate',
  'heroin', 'diacetylmorphine',
  'codeine phosphate',
  'oxycodone',
  'hydrocodone',
  'fentanyl', 'fentanyl citrate',
  'methadone',
  'tramadol',
  // Nitazenes
  'isotonitazene',
  'metonitazene',
  'protonitazene',
  'butonitazene',
  'etonitazene',
  'etodesnitazene',
  'n-pyrrolidino etonitazene',
  'bromazolam',
  // Research Chemicals
  'crystal meth', 'methamphetamine',
  '3-cmc', '4-cmc',
  '3-mmc', '4-mmc', 'mephedrone',
  'alpha-pihp',
  'ketamine',
  'alpha-pvp',
];

export const secondaryKeywords = [
  'research chemicals',
  'synthetic cannabinoids',
  'laboratory chemicals',
  'premium research chemicals',
  'buy research chemicals online',
  'opioids',
  'nitazenes',
  'cannabinoids for research',
  'chemical compounds',
  'laboratory grade chemicals'
];

export const allKeywords = [...primaryKeywords, ...secondaryKeywords];

// Schema.org structured data for better SEO
export const getProductSchema = (product) => {
  const startingPrice = product.priceVariants?.[0]?.price ?? product.price;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || `${BASE_URL}/images/logo.png`,
    brand: { '@type': 'Brand', name: 'BuyResearchChems' },
    offers: {
      '@type': 'Offer',
      price: startingPrice ?? 0,
      priceCurrency: 'EUR',
      availability: product.countInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/products/${product.slug}`,
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.numReviews || 1,
    } : undefined,
  };
};

// Get base URL for schemas
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com';
};

// Organization schema
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BuyResearchChems',
  description: 'Premium research chemicals supplier — synthetic cannabinoids, opioids, nitazenes and laboratory-grade compounds for scientific research.',
  url: getBaseUrl(),
  logo: {
    '@type': 'ImageObject',
    url: `${getBaseUrl()}/images/logo.png`,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'order@researchchems.online',
    availableLanguage: 'English',
  },
  sameAs: [],
});

// Website schema with SearchAction for sitelinks search box
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BuyResearchChems',
  description: 'Premium research chemicals — synthetic cannabinoids, opioids, nitazenes and laboratory compounds.',
  url: getBaseUrl(),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${getBaseUrl()}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export default function SEOKeywords() {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
