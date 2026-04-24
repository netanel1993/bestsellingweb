import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `About ${siteConfig.name}`,
  description: `Learn how ${siteConfig.name} curates the best selling AliExpress products — our editorial process, affiliate disclosure and how we keep listings fresh.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-lg py-8">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About", href: "/about", current: true }]} />
      <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
        <h1>About {siteConfig.name}</h1>
        <p className="lead">
          {siteConfig.name} is a curated marketplace guide that surfaces the best selling and
          highest-rated products from AliExpress — so you can shop smarter, faster and cheaper.
        </p>

        <h2>How we curate</h2>
        <p>
          Every product featured on {siteConfig.name} is selected by a human editor based on:
        </p>
        <ul>
          <li>Order volume and sustained sales velocity</li>
          <li>Verified customer rating of 4.5 stars or higher</li>
          <li>At least several hundred authentic reviews</li>
          <li>Seller reputation, response rate and shipping reliability</li>
          <li>Price competitiveness vs. comparable listings</li>
        </ul>

        <h2>Affiliate disclosure</h2>
        <p>
          {siteConfig.name} participates in the AliExpress affiliate program. When you click a
          &ldquo;Buy on AliExpress&rdquo; button and complete a purchase, we may earn a small
          commission at no additional cost to you. This funds our editorial work and keeps the
          site free for readers.
        </p>

        <h2>Editorial independence</h2>
        <p>
          We never accept payment to feature a product. Our rankings are based on data and
          editorial judgment — not sponsorships.
        </p>

        <h2>Contact</h2>
        <p>
          Have a product tip, question or correction? <Link href="/contact">Get in touch</Link>.
        </p>
      </article>
    </div>
  );
}
