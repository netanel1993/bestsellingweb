import { getAllProducts } from "@/lib/products";
import { GoRedirect } from "./GoRedirect";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export default function GoPage({ params }: { params: { id: string } }) {
  return <GoRedirect id={params.id} />;
}
