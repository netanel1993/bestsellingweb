import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} about product tips, corrections or partnerships.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact", current: true },
        ]}
      />
      <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
        <h1>Contact us</h1>
        <p>
          Have a product tip, a correction, or a partnership inquiry? Email us at{" "}
          <a href="mailto:hello@bestsellingweb.com">hello@bestsellingweb.com</a> and we&apos;ll
          get back to you within 2 business days.
        </p>
      </article>
    </div>
  );
}
