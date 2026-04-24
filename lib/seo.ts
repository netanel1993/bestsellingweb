import type { Metadata } from "next";
import type { Product } from "@/data/products";
import { absoluteUrl, siteConfig } from "@/lib/site";

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
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
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
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
