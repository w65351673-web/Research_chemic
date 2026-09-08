export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com'),
  title: 'About BuyResearchChems | Premium Research Chemicals Supplier',
  description: 'BuyResearchChems is a trusted supplier of high-purity research chemicals including 5cl-adba, jwh-018, adb-butinaca, opioids and nitazenes. Lab-verified compounds with certificates of analysis.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About BuyResearchChems | Premium Research Chemicals Supplier',
    description: 'BuyResearchChems supplies high-purity research chemicals to scientists and laboratories worldwide. Verified compounds, discreet shipping, full certificates of analysis.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
