import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  electronics: [
    "best aliexpress electronics",
    "cheap gadgets aliexpress",
    "aliexpress wireless earbuds",
    "aliexpress smartwatch deals",
    "aliexpress tech deals",
  ],
  "home-kitchen": [
    "best aliexpress home gadgets",
    "aliexpress kitchen tools",
    "aliexpress home accessories",
    "cheap home gadgets aliexpress",
    "aliexpress cleaning gadgets",
  ],
  beauty: [
    "best aliexpress beauty products",
    "aliexpress skincare devices",
    "cheap beauty gadgets aliexpress",
    "aliexpress hair tools",
    "aliexpress beauty deals",
  ],
  fashion: [
    "best aliexpress fashion",
    "aliexpress accessories deals",
    "cheap watches aliexpress",
    "aliexpress bags deals",
    "aliexpress jewelry deals",
  ],
  fitness: [
    "best aliexpress fitness gear",
    "aliexpress workout equipment",
    "cheap fitness accessories aliexpress",
    "aliexpress gym equipment",
    "aliexpress outdoor gear",
  ],
  "toys-hobbies": [
    "best aliexpress toys",
    "aliexpress hobby kits",
    "cheap toys aliexpress",
    "aliexpress stem toys",
    "aliexpress kids toys deals",
  ],
};

const CATEGORY_GUIDE: Record<string, { heading: string; body: string }> = {
  electronics: {
    heading: "How to find the best electronics deals on AliExpress",
    body: "AliExpress is one of the largest sources of affordable consumer electronics. When shopping for gadgets, look for listings with at least 500 orders and a rating above 4.5 — our editors have already filtered for exactly that. Every product on this page ships free and comes from sellers with proven track records.",
  },
  "home-kitchen": {
    heading: "Why AliExpress is great for home & kitchen gadgets",
    body: "From viral cleaning gadgets to smart LED strips, AliExpress offers home accessories at a fraction of retail price. We pick only the items with high order volume and verified reviews so you avoid the low-quality listings that clutter regular search results.",
  },
  beauty: {
    heading: "Best AliExpress beauty devices — what to look for",
    body: "AliExpress beauty products have gone viral on social media for good reason: sonic cleansers, ionic hair tools and LED face masks that cost $15–$40 instead of $200+. We verify seller credentials and review authenticity before featuring any product on this page.",
  },
  fashion: {
    heading: "Finding quality fashion & accessories on AliExpress",
    body: "AliExpress stocks thousands of fashion accessories — watches, leather bags, jewelry — at prices that compete with fast-fashion brands. We focus on sellers with 4.7+ ratings and 1,000+ orders to ensure you receive items that match the photos.",
  },
  fitness: {
    heading: "Budget fitness gear that actually works",
    body: "You do not need to spend hundreds on fitness equipment. AliExpress resistance bands, smart fitness watches and camping gear from our list have been ordered by tens of thousands of customers who rated them 4.5 stars or higher.",
  },
  "toys-hobbies": {
    heading: "Top-rated AliExpress toys and hobby kits",
    body: "AliExpress toys and STEM kits are popular with parents looking for quality at a lower price. All products on this page carry ASTM or CE safety certifications as listed by their sellers, and have thousands of positive reviews from real buyers.",
  },
};

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return { title: "Not found" };

  const title = `Best ${category.name} Deals on AliExpress ${new Date().getFullYear()} – ${category.name} Bargains`;
  const description = `Discover the best selling ${category.name.toLowerCase()} on AliExpress — hand-picked for quality, price and free shipping. Updated daily with the latest deals and discounts.`;

  return buildMetadata({
    title,
    description,
    path: `/category/${category.slug}`,
    keywords: CATEGORY_KEYWORDS[category.slug] ?? [],
  });
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const guide = CATEGORY_GUIDE[category.slug];

  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All deals", href: "/products" },
          { name: category.name, href: `/category/${category.slug}`, current: true },
        ]}
      />

      <JsonLd data={collectionPageJsonLd(
        `Best ${category.name} Deals`,
        category.description,
        `/category/${category.slug}`,
      )} />
      <JsonLd data={itemListJsonLd(products, `Best ${category.name} Deals on AliExpress`, `/category/${category.slug}`)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "All deals", url: "/products" },
          { name: category.name, url: `/category/${category.slug}` },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="mr-2" aria-hidden>{category.emoji}</span>
          Best {category.name} Deals on AliExpress
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          {category.description} Updated daily — all items ship free.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
            ✅ {products.length} curated picks
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
            🚚 Free shipping
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
            ⭐ 4.5+ rated only
          </span>
        </div>
      </header>

      <ProductGrid products={products} />

      {guide && (
        <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <h2 className="text-lg font-bold">{guide.heading}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {guide.body}
          </p>
        </section>
      )}

      <section className="mt-10 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Looking for another category?
        </p>
        <Link href="/products" className="btn-primary mt-3 inline-block">
          Browse all deals
        </Link>
      </section>
    </div>
  );
}
