import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export function ProductDetail() {
  const { id } = useParams()
  const { addToCart, products } = useStore()
  const [product, setProduct] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr(null)
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then((d) => {
        if (!cancelled) setProduct(d)
      })
      .catch(() => {
        if (!cancelled) setErr('We could not load this product.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const related = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : []

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-mud/50">Loading…</div>
    )
  }

  if (err || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-rose-700">{err || 'Product missing.'}</p>
        <Link to="/products" className="mt-4 inline-block text-sand underline">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-mud/10 bg-cream/80 p-6 md:p-10">
          <img
            src={product.image}
            alt=""
            className="mx-auto h-full max-h-96 w-full max-w-md object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-sand">Wadi / {product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-mud md:text-4xl">{product.title}</h1>
          <p className="mt-4 text-3xl font-semibold text-sand">${product.price.toFixed(2)}</p>
          <p className="mt-4 leading-relaxed text-mud/75">{product.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-mud/12 bg-paper p-0.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-full text-mud"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="h-10 w-10 rounded-full text-mud"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => addToCart(product, qty)}
              className="flex-1 min-w-[10rem] rounded-full bg-mud py-3 text-sm font-semibold text-cream transition hover:bg-mud-light sm:flex-none"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-mud/10 pt-12">
          <h2 className="font-display text-2xl font-semibold">You may also like</h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/product/${p.id}`}
                  className="block overflow-hidden rounded-2xl border border-mud/8 bg-paper transition hover:shadow"
                >
                  <div className="flex aspect-square items-center justify-center bg-cream p-4">
                    <img src={p.image} alt="" className="h-40 w-40 object-contain" />
                  </div>
                  <p className="p-3 text-sm font-medium line-clamp-2 text-mud">{p.title}</p>
                  <p className="px-3 pb-3 text-sand font-semibold">${p.price.toFixed(2)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
