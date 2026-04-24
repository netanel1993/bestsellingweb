"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildAffiliateUrl, getProductById } from "@/lib/products";

export function GoRedirect({ id }: { id: string }) {
  const router = useRouter();

  useEffect(() => {
    const product = getProductById(id);
    if (product) {
      window.location.replace(buildAffiliateUrl(product));
    } else {
      router.replace("/products");
    }
  }, [id, router]);

  return (
    <div className="container-lg flex min-h-[60vh] items-center justify-center">
      <p className="text-slate-500">Redirecting to AliExpress…</p>
    </div>
  );
}
