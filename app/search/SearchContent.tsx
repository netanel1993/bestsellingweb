"use client";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { searchProducts } from "@/lib/products";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const results = query ? searchProducts(query) : [];

  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search", current: true },
        ]}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Search</h1>
        <form action="/search" method="get" role="search" className="mt-4 flex max-w-lg gap-2">
          <label htmlFor="q" className="sr-only">Search products</label>
          <input
            id="q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search for earbuds, smart watch, LED lights…"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
          />
          <button className="btn-primary" type="submit">
            Search
          </button>
        </form>
        {query && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold">&ldquo;{query}&rdquo;</span>
          </p>
        )}
      </header>
      {query ? (
        <ProductGrid products={results} />
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          Start typing to search across all best selling deals.
        </p>
      )}
    </div>
  );
}
