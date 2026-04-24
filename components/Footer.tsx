import Link from "next/link";
import { CATEGORIES } from "@/data/products";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-lg grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h2 className="text-base font-bold">BestSellingWeb</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Hand-picked best selling AliExpress deals. Curated daily, reviewed honestly.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li><Link href="/products" className="hover:text-brand-600">All deals</Link></li>
            <li><Link href="/search" className="hover:text-brand-600">Search</Link></li>
            <li><Link href="/about" className="hover:text-brand-600">About</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Categories</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-brand-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/disclosure" className="hover:text-brand-600">Affiliate disclosure</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-600">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-brand-600">Terms of use</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        <p className="container-lg">
          &copy; {year} BestSellingWeb. As an AliExpress affiliate, we may earn a small commission
          from qualifying purchases at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}
