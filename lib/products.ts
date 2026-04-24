import { CATEGORIES, PRODUCTS, type Category, type Product } from "@/data/products";

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getTrendingProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.trending).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });
}

export function discountPercent(p: Product): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

export function formatPrice(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildAffiliateUrl(product: Product): string {
  const trackingId = process.env.NEXT_PUBLIC_ALIEXPRESS_TRACKING_ID;
  const url = new URL(product.aliexpressUrl);
  if (trackingId) {
    url.searchParams.set("aff_fcid", trackingId);
    url.searchParams.set("aff_platform", "link");
    url.searchParams.set("sk", trackingId);
  }
  return url.toString();
}
