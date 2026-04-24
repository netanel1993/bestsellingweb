import Link from "next/link";

export type Crumb = { name: string; href: string; current?: boolean };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {item.current ? (
              <span aria-current="page" className="text-slate-700 dark:text-slate-200">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-brand-600">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
