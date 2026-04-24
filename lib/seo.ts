import type { Metadata } from "next";
import type { Product } from "@/data/products";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatPrice } from "@/lib/products";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "product";
  keywords?: string[];
};

export function buildMetadata(opts: PageSeoOptions): Metadata {
  const url = absoluteUrl(opts.path);
  const image = opts.image ?? siteConfig.defaultOgImage;
  const absoluteImage = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords ?? siteConfig.keywords,
    alternates: { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: opts.type === "product" ? "website" : opts.type ?? "website",
      images: [{ url: absoluteImage, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [absoluteImage],
      site: siteConfig.twitterHandle,
    },
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const title = `${product.shortTitle} – ${formatPrice(product.price)} | ${siteConfig.name}`;
  const description = [
    `Buy ${product.shortTitle} for only ${formatPrice(product.price, product.currency)}`,
    discount > 0 ? `(${discount}% off, was ${formatPrice(product.originalPrice, product.currency)})` : "",
    `on AliExpress.`,
    `Rated ${product.rating}/5 by ${product.reviewCount.toLocaleString()} verified buyers.`,
    product.freeShipping ? "Free shipping." : "",
    product.description.slice(0, 80) + "…",
  ]
    .filter(Boolean)
    .join(" ");

  return buildMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    image: product.images[0],
    type: "product",
    keywords: [
      ...product.tags,
      `${product.shortTitle.toLowerCase()} aliexpress`,
      `buy ${product.shortTitle.toLowerCase()}`,
      `cheap ${product.shortTitle.toLowerCase()}`,
      `best ${product.shortTitle.toLowerCase()} deal`,
    ],
  });
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "AliExpress" },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      shippingDetails: product.freeShipping
        ? {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 7, maxValue: 20, unitCode: "DAY" },
            },
          }
        : undefined,
    },
  };
}

export function faqJsonLd(product: Product) {
  const price = formatPrice(product.price, product.currency);
  const originalPrice = formatPrice(product.originalPrice, product.currency);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does ${product.shortTitle} cost on AliExpress?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${product.shortTitle} currently costs ${price} on AliExpress${product.originalPrice > product.price ? `, reduced from ${originalPrice}` : ""}. ${product.freeShipping ? "Free shipping is included." : "Shipping costs are shown at checkout."}`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${product.shortTitle} worth buying?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. ${product.shortTitle} holds a ${product.rating}/5 star rating from ${product.reviewCount.toLocaleString()} verified buyers, with over ${product.ordersCount.toLocaleString()} orders completed. It is one of the best-rated products in its category on AliExpress.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${product.shortTitle} ship for free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: product.freeShipping
            ? `Yes, ${product.shortTitle} ships for free from ${product.shippingFrom}. Delivery typically takes 7–20 business days.`
            : `Standard shipping fees apply for ${product.shortTitle}. Check the AliExpress listing for the latest shipping options to your country.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${product.shortTitle} brand?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${product.shortTitle} is sold by ${product.brand} on AliExpress.`,
        },
      },
    ],
  };
}

export function itemListJsonLd(
  products: Product[],
  listName: string,
  listUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: absoluteUrl(listUrl),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: absoluteUrl(`/products/${p.slug}`),
      image: p.image,
    })),
  };
}

export function collectionPageJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(url),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl(),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl(),
    logo: absoluteUrl("/logo.svg"),
    description: siteConfig.description,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(),
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
