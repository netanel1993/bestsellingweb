import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { getFeaturedProducts, getTrendingProducts } from "@/lib/products";
import { getAllCategories } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} – ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const trending = getTrendingProducts(8);
  const categories = getAllCategories();

  return (
    <>
      <Hero />

      <section aria-labelledby="featured" className="container-lg py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 id="featured" className="text-2xl font-bold sm:text-3xl">
              Featured best sellers
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Hand-picked products shoppers love right now.
            </p>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-brand-600 hover:underline sm:block">
            View all deals →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section aria-labelledby="categories" className="bg-slate-50 py-12 dark:bg-slate-900/40">
        <div className="container-lg">
          <h2 id="categories" className="text-2xl font-bold sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Find exactly what you need, faster.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="card flex flex-col items-center gap-2 p-6 text-center"
              >
                <span className="text-3xl" aria-hidden>{c.emoji}</span>
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="trending" className="container-lg py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 id="trending" className="text-2xl font-bold sm:text-3xl">
              Trending now
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              What shoppers are buying this week.
            </p>
          </div>
        </div>
        <ProductGrid products={trending} />
      </section>

      <section className="container-lg py-12">
        <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 p-8 text-white shadow-lg sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Why shop with BestSellingWeb?</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">🔎 Curated, not cluttered</h3>
              <p className="mt-1 text-sm text-white/90">
                Every listing is hand-reviewed for quality, ratings and real reviews.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">💸 Lowest prices we can find</h3>
              <p className="mt-1 text-sm text-white/90">
                We track price drops daily so you always get the best deal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">🚚 Direct to AliExpress</h3>
              <p className="mt-1 text-sm text-white/90">
                One click takes you straight to checkout with free shipping available.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
