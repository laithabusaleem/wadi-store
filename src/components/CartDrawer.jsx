import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeLine, subtotal, clearCart } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.toggle('cart-open', cartOpen)
    return () => document.body.classList.remove('cart-open')
  }, [cartOpen])

  const checkout = () => {
    if (cart.length === 0) return
    clearCart()
    setCartOpen(false)
    navigate('/checkout/success')
  }

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="absolute inset-0 bg-mud/40 backdrop-blur-sm transition"
        onClick={() => setCartOpen(false)}
        aria-label="Close cart overlay"
      />
      <div className="cart-panel-animate absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl sm:border-l sm:border-mud/10">
        <div className="flex items-center justify-between border-b border-mud/10 px-4 py-4">
          <h2 className="font-display text-lg font-semibold">Your cart</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="rounded-lg p-2 text-mud/60 transition hover:bg-mud/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {cart.length === 0 ? (
            <p className="mt-8 text-center text-sm text-mud/50">Your basket is empty — explore the souq.</p>
          ) : (
            <ul className="divide-y divide-mud/10">
              {cart.map((line) => (
                <li key={line.id} className="flex gap-3 py-4">
                  <img
                    src={line.image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-mud/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-mud">{line.title}</p>
                    <p className="mt-0.5 text-sm font-semibold text-sand">${line.price.toFixed(2)} each</p>
                    <div className="mt-2 flex max-w-[9rem] items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(line.id, line.quantity - 1)}
                        className="h-7 w-7 rounded border border-mud/15 text-mud"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(line.id, line.quantity + 1)}
                        className="h-7 w-7 rounded border border-mud/15 text-mud"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="ml-2 text-xs text-rose-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 ? (
          <div className="border-t border-mud/10 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-mud/70">Subtotal (USD)</span>
              <span className="text-lg font-semibold tabular-nums text-mud">${subtotal.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={checkout}
              className="w-full rounded-full bg-mud py-3 text-sm font-semibold text-cream transition hover:bg-mud-light"
            >
              Checkout
            </button>
            <p className="mt-2 text-center text-xs text-mud/45">No real payment — demo only</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
