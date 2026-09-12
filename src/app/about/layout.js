export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com'),
  title: 'About BuyResearchChems | Trusted Research Chemicals Supplier',
  description: 'Learn about BuyResearchChems — a leading supplier of high-purity research chemicals, synthetic cannabinoids (5cl-adba, 5fadb, jwh-018), opioids, nitazenes and laboratory-grade compounds with COA and discreet worldwide shipping.',
  keywords: [
    'BuyResearchChems', 'research chemicals supplier', 'buy research chemicals',
    'synthetic cannabinoids', '5cl-adba', '5fadb', 'jwh-018', 'adb-butinaca',
    'opioids', 'nitazenes', 'laboratory chemicals', 'certificate of analysis',
    'discreet shipping', 'lab verified compounds',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About BuyResearchChems | Trusted Research Chemicals Supplier',
    description: 'BuyResearchChems supplies high-purity research chemicals to scientists and laboratories worldwide. Verified compounds, discreet shipping, full certificates of analysis.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
