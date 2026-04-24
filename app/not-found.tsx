import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-lg flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">404</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
        The page you were looking for doesn&apos;t exist, but our best selling deals do.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Browse best sellers
      </Link>
    </div>
  );
}
