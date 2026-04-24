import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { StarRating } from "@/components/StarRating";
import { JsonLd } from "@/components/JsonLd";
import {
  discountPercent,
  formatPrice,
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";
import { getCategoryBySlug } from "@/lib/products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return buildMetadata({ title: "Not found", description: "", path: "/" });
  return buildMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${product.slug}`,
    image: product.images[0],
    keywords: product.tags,
    type: "product",
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const discount = discountPercent(product);
  const related = getRelatedProducts(product, 4);

  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All deals", href: "/products" },
          ...(category ? [{ name: category.name, href: `/category/${category.slug}` }] : []),
          { name: product.shortTitle, href: `/products/${product.slug}`, current: true },
        ]}
      />

      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "All deals", url: "/products" },
          ...(category ? [{ name: category.name, url: `/category/${category.slug}` }] : []),
          { name: product.shortTitle, url: `/products/${product.slug}` },
        ])}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={product.images[0] ?? product.image}
              alt={product.title}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">
                -{discount}% off
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Image src={src} alt={`${product.title} view ${i + 1}`} fill sizes="15vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <StarRating value={product.rating} size={16} />
            <span>{product.reviewCount.toLocaleString()} reviews</span>
            <span aria-hidden>•</span>
            <span>{product.ordersCount.toLocaleString()}+ orders</span>
            <span aria-hidden>•</span>
            <span>Brand: {product.brand}</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-brand-600">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-slate-500 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
                <span className="rounded bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                  You save {formatPrice(product.originalPrice - product.price, product.currency)}
                </span>
              </>
            )}
          </div>

          <ul className="mt-6 space-y-2 text-sm">
            {product.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span aria-hidden className="mt-0.5 text-brand-600">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            {product.freeShipping && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                🚚 Free shipping
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              Ships from {product.shippingFrom}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`/go/${product.id}`}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="btn-primary flex-1 text-base"
              aria-label={`Buy ${product.shortTitle} on AliExpress`}
            >
              Buy on AliExpress →
            </a>
            <Link href="/products" className="btn-outline flex-1 text-base">
              Back to deals
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Price and availability are subject to change. BestSellingWeb may earn a commission
            on qualifying purchases.
          </p>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="desc">
        <h2 id="desc" className="text-xl font-bold">About this product</h2>
        <p className="mt-2 max-w-3xl text-slate-700 dark:text-slate-300">{product.description}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="text-xl font-bold">You might also like</h2>
          <div className="mt-4">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
