import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGrid } from "@/components/ProductGrid";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/products";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return buildMetadata({ title: "Not found", description: "", path: "/" });
  return buildMetadata({
    title: `Best ${category.name} deals on AliExpress`,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);

  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/products" },
          { name: category.name, href: `/category/${category.slug}`, current: true },
        ]}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Categories", url: "/products" },
          { name: category.name, url: `/category/${category.slug}` },
        ])}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="mr-2" aria-hidden>{category.emoji}</span>
          Best {category.name} deals
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{category.description}</p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
