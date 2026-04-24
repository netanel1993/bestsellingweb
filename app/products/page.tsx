import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { JsonLd } from "@/components/JsonLd";
import { getAllCategories, getAllProducts } from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "All Best Selling AliExpress Deals 2026 – Up to 70% Off",
  description:
    "Browse every hand-picked AliExpress deal on BestSellingWeb. Trending gadgets, home, beauty, fashion, fitness and more — 4.5+ rated, free shipping, updated daily.",
  path: "/products",
  keywords: [
    "all aliexpress deals",
    "best aliexpress products 2026",
    "aliexpress trending items",
    "cheap aliexpress finds",
    "best selling aliexpress 2026",
  ],
});

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div className="container-lg py-8">
      <JsonLd data={collectionPageJsonLd(
        "All Best Selling AliExpress Deals",
        "Hand-picked best sellers from AliExpress with free shipping and verified ratings.",
        "/products",
      )} />
      <JsonLd data={itemListJsonLd(products, "Best Selling AliExpress Products", "/products")} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "All deals", url: "/products" },
      ])} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All deals", href: "/products", current: true },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          All best selling AliExpress deals
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Every product we track, in one place. Hand-picked by our editors, rated 4.5+ stars,
          free shipping — updated daily with the latest AliExpress price drops.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
            ✅ {products.length} curated deals
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
            🚚 Free shipping on all
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
            ⭐ 4.5+ rated only
          </span>
        </div>
      </header>

      {/* Category filter links */}
      <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900"
          >
            {c.emoji} {c.name}
          </Link>
        ))}
      </nav>

      <ProductGrid products={products} />
    </div>
  );
}
