import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { SearchContent } from "./SearchContent";

export const metadata: Metadata = buildMetadata({
  title: "Search best selling products",
  description:
    "Search the BestSellingWeb catalog for trending AliExpress products across electronics, home, beauty, fashion, fitness and more.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
