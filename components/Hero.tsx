import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-amber-400 text-white"
      aria-labelledby="hero-heading"
    >
      <div className="container-lg grid gap-8 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <span aria-hidden>🔥</span> Updated daily
          </p>
          <h1 id="hero-heading" className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            The best selling AliExpress deals, curated for you.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-white/90">
            Discover trending gadgets, home must-haves and viral finds — all hand-picked and
            linked directly to AliExpress with the lowest prices we can find.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-slate-100"
            >
              Shop best sellers
            </Link>
            <Link
              href="/category/electronics"
              className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Browse electronics
            </Link>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/70">Products curated</dt>
              <dd className="text-2xl font-bold">500+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/70">Avg. discount</dt>
              <dd className="text-2xl font-bold">~60%</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/70">Free shipping</dt>
              <dd className="text-2xl font-bold">Yes</dd>
            </div>
          </dl>
        </div>
        <div className="relative hidden items-center justify-center md:flex">
          <div className="absolute -right-12 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative grid grid-cols-2 gap-4">
            {["📱", "🎧", "💡", "💄"].map((emoji, i) => (
              <div
                key={i}
                className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white/15 text-5xl shadow-xl backdrop-blur"
                aria-hidden
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
