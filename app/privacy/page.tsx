import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description: `${siteConfig.name} privacy policy: what data we collect and how we use it.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy", href: "/privacy", current: true },
        ]}
      />
      <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
        <h1>Privacy policy</h1>
        <p>
          {siteConfig.name} respects your privacy. This site does not collect personally
          identifiable information except what you voluntarily provide via contact forms.
        </p>
        <h2>Cookies and analytics</h2>
        <p>
          We may use privacy-friendly analytics to understand aggregate traffic. Affiliate
          networks (such as AliExpress) may set tracking cookies when you click outgoing links
          to attribute purchases. See each partner&apos;s policy for details.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy questions, use our contact page. We will respond within 30 days.
        </p>
      </article>
    </div>
  );
}
