import Link from "next/link";
import { CATEGORIES } from "@/data/products";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container-lg flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden className="text-xl">🛒</span>
          <span>
            Best<span className="text-brand-600">Selling</span>Web
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <Link href="/products" className="hover:text-brand-600">All deals</Link>
          <div className="group relative">
            <button className="hover:text-brand-600" aria-haspopup="true">Categories</button>
            <div className="invisible absolute left-0 top-full mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="block rounded px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="mr-2" aria-hidden>{c.emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about" className="hover:text-brand-600">About</Link>
        </nav>

        <form action="/search" method="get" role="search" className="hidden w-64 md:block">
          <label htmlFor="q" className="sr-only">Search products</label>
          <input
            id="q"
            type="search"
            name="q"
            placeholder="Search best sellers..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
          />
        </form>
      </div>
      <nav aria-label="Categories" className="border-t border-slate-100 dark:border-slate-800 md:hidden">
        <div className="container-lg flex gap-4 overflow-x-auto py-2 text-sm">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap text-slate-600 hover:text-brand-600 dark:text-slate-300"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
