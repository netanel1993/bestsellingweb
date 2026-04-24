import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate disclosure",
  description: `How ${siteConfig.name} earns money: full affiliate disclosure as required by the FTC.`,
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <div className="container-lg py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Affiliate disclosure", href: "/disclosure", current: true },
        ]}
      />
      <article className="prose prose-slate mx-auto max-w-3xl dark:prose-invert">
        <h1>Affiliate disclosure</h1>
        <p>
          {siteConfig.name} is a participant in the AliExpress affiliate program, an
          advertising program designed to provide a means for sites to earn advertising fees by
          linking to AliExpress.
        </p>
        <p>
          When you click a link on this site and complete a purchase on AliExpress, we may
          receive a small commission at no extra cost to you.
        </p>
        <p>
          We only recommend products we would happily buy ourselves. Commissions never influence
          which products we feature or how we rank them.
        </p>
      </article>
    </div>
  );
}
