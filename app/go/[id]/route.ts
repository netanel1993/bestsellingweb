import { NextResponse, type NextRequest } from "next/server";
import { buildAffiliateUrl, getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

export function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) {
    return NextResponse.redirect(new URL("/products", _req.url), 302);
  }
  const target = buildAffiliateUrl(product);
  const res = NextResponse.redirect(target, 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
