import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllProducts } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "All best selling deals",
  description:
    "Browse every hand-picked AliExpress deal on BestSellingWeb. Trending gadgets, home, beauty, fashion, fitness and more — updated daily.",
  path: "/products",
});

export default function ProductsPage() {
  const products = getAllProducts();
  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All deals", href: "/products", current: true },
        ]}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">All best selling deals</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Every product we track, in one place. Sorted by our editors and updated daily with the
          latest AliExpress price drops.
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
