import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { discountPercent, formatPrice } from "@/lib/products";
import { StarRating } from "@/components/StarRating";

export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);
  return (
    <article className="card flex h-full flex-col">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition duration-300 hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.freeShipping && (
          <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Free ship
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold">
          <Link href={`/products/${product.slug}`} className="hover:text-brand-600">
            {product.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <StarRating value={product.rating} />
          <span>({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-600">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-500 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <Link href={`/products/${product.slug}`} className="btn-outline flex-1 text-xs">
            Details
          </Link>
          <a
            href={`/go/${product.id}`}
            rel="sponsored nofollow noopener"
            target="_blank"
            className="btn-primary flex-1 text-xs"
            aria-label={`Buy ${product.shortTitle} on AliExpress`}
          >
            Buy now
          </a>
        </div>
      </div>
    </article>
  );
}
