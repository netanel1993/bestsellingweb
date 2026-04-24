import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of use",
  description: `${siteConfig.name} terms of use.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Terms", href: "/terms", current: true },
        ]}
      />
      <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
        <h1>Terms of use</h1>
        <p>
          By using {siteConfig.name}, you agree to these terms. Product prices, availability and
          specifications are controlled by AliExpress and its sellers, and may change without
          notice. {siteConfig.name} is not the seller of record and is not responsible for
          fulfillment, returns or warranty claims.
        </p>
        <p>
          Content on this site is provided for informational purposes only and does not
          constitute a purchase offer. All trademarks are the property of their respective
          owners.
        </p>
      </article>
    </div>
  );
}
