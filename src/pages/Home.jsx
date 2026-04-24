import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useState } from 'react'

function ProductCard({ p }) {
  return (
    <Link
      to={`/product/${p.id}`}
      className="group overflow-hidden rounded-2xl border border-mud/8 bg-paper shadow-sm transition hover:-translate-y-0.5 hover:border-sand/50 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={p.image}
          alt=""
          className="h-full w-full object-contain p-4 transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-mud">{p.title}</h3>
        <p className="mt-2 text-lg font-semibold text-sand">${p.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}

export function Home() {
  const { products, loading, loadError, categoryList, setSearchQuery } = useStore()
  const [newsletter, setNewsletter] = useState({ email: '', status: 'idle' })

  const featured = products.slice(0, 8)

  const onNewsletter = (e) => {
    e.preventDefault()
    if (!newsletter.email.trim()) return
    setNewsletter((n) => ({ ...n, status: 'ok' }))
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-mud/10">
        <div
          className="absolute inset-0 bg-gradient-to-br from-mud via-mud to-mud-light"
          aria-hidden
        />
        <div
          className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-sand/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sand">Jordan · Since 2024</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-cream md:text-5xl">
            Wadi — where craft meets the everyday
          </h1>
          <p className="mt-4 max-w-xl text-lg text-cream/80">
            Curated home goods, textiles, and small-batch finds with the warmth of the Levant. Shop like a
            local.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex rounded-full bg-sand px-6 py-3 text-sm font-semibold text-mud shadow-lg transition hover:bg-sand-light"
            >
              Browse the collection
            </Link>
            <a
              href="#featured"
              className="inline-flex rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream/90 transition hover:border-cream hover:bg-cream/5"
            >
              See featured
            </a>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-mud">Featured this week</h2>
            <p className="text-sm text-mud/55">Eight picks we love from the souq</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-sand underline decoration-sand/40 hover:decoration-sand">
            View all
          </Link>
        </div>
        {loading && <p className="mt-8 text-mud/50">Loading products…</p>}
        {loadError && <p className="mt-8 text-rose-700">{loadError}</p>}
        {!loading && !loadError && (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <li key={p.id}>
                <ProductCard p={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-y border-mud/10 bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <h2 className="font-display text-2xl font-semibold text-mud">Shop by category</h2>
          <p className="text-sm text-mud/55">Filter the full catalog in one click</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {categoryList.map((c) => (
              <li key={c}>
                <Link
                  to="/products"
                  onClick={() => {
                    setSearchQuery('')
                    sessionStorage.setItem('wadi-category', c)
                  }}
                  className="inline-block rounded-full border border-mud/12 bg-cream/60 px-4 py-2 text-sm capitalize text-mud transition hover:border-sand hover:bg-sand/15"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-lg rounded-3xl border border-sand/30 bg-gradient-to-b from-cream to-paper p-8 text-center shadow-inner md:p-10">
          <h2 className="font-display text-2xl font-semibold text-mud">The Wadi letter</h2>
          <p className="mt-2 text-sm text-mud/60">New drops, studio visits, and member-only offers.</p>
          {newsletter.status === 'ok' ? (
            <p className="mt-6 text-sm font-medium text-emerald-800">You are in — check your inbox soon.</p>
          ) : (
            <form onSubmit={onNewsletter} className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <input
                type="email"
                value={newsletter.email}
                onChange={(e) => setNewsletter((n) => ({ ...n, email: e.target.value }))}
                required
                placeholder="you@email.com"
                className="w-full min-w-0 flex-1 rounded-full border border-mud/15 bg-white px-4 py-2.5 text-sm focus:border-sand focus:outline-none focus:ring-2 focus:ring-sand/20 sm:max-w-xs"
              />
              <button
                type="submit"
                className="rounded-full bg-mud px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-mud-light"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
