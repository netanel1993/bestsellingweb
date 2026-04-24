export const siteConfig = {
  name: "BestSellingWeb",
  tagline: "Hand-picked best selling AliExpress deals",
  description:
    "BestSellingWeb curates the best selling and trending products from AliExpress with honest reviews, verified ratings and the lowest prices we can find. Discover viral gadgets, home must-haves, fashion and more.",
  defaultOgImage: "/og-default.svg",
  twitterHandle: "@bestsellingweb",
  locale: "en_US",
  keywords: [
    "best selling aliexpress",
    "trending aliexpress products",
    "aliexpress deals",
    "best aliexpress finds",
    "cheap gadgets",
    "affiliate deals",
    "aliexpress review",
  ],
};

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return url && url.length > 0 ? url : "https://bestsellingweb.com";
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
