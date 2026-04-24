import { Link } from 'react-router-dom'

export function CheckoutSuccess() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700" aria-hidden>
        ✓
      </div>
      <h1 className="font-display text-3xl font-semibold text-mud">Order received</h1>
      <p className="mt-3 text-mud/70">
        Thanks for shopping with Wadi. In a real store we would email your receipt—here it is a demo
        success screen only.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/products"
          className="inline-flex rounded-full bg-mud px-6 py-2.5 text-sm font-semibold text-cream hover:bg-mud-light"
        >
          Keep shopping
        </Link>
        <Link
          to="/"
          className="inline-flex rounded-full border border-mud/15 px-6 py-2.5 text-sm font-semibold text-mud hover:border-sand"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
