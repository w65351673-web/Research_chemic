import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buyresearchchems.com';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).select('name description category priceVariants images').lean();

    if (!product) {
      return {
        title: 'Product Not Found | BuyResearchChems',
        description: 'The product you are looking for could not be found.',
      };
    }

    const startingPrice = product.priceVariants?.[0]?.price;
    const priceText = startingPrice ? ` Starting from €${startingPrice}.` : '';
    const shortDesc = product.description
      ? product.description.slice(0, 155).replace(/\n/g, ' ').trim() + '…'
      : `Buy ${product.name} — high-purity ${product.category} research compound.${priceText}`;

    const image = product.images?.[0] || `${BASE_URL}/images/logo.png`;

    return {
      metadataBase: new URL(BASE_URL),
      title: `${product.name} | BuyResearchChems`,
      description: shortDesc,
      keywords: [
        product.name,
        product.category,
        'buy ' + product.name.toLowerCase(),
        product.name.toLowerCase() + ' for sale',
        'research chemicals',
        'BuyResearchChems',
        'high purity',
        'certificate of analysis',
      ],
      alternates: {
        canonical: `/products/${slug}`,
      },
      openGraph: {
        title: `${product.name} | BuyResearchChems`,
        description: shortDesc,
        url: `/products/${slug}`,
        type: 'website',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | BuyResearchChems`,
        description: shortDesc,
        images: [image],
      },
    };
  } catch {
    return {
      title: 'BuyResearchChems | Research Chemicals',
      description: 'Premium research chemicals — high purity, certificate of analysis, discreet shipping.',
    };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
