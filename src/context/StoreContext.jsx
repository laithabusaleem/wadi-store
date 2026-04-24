import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CART_KEY = 'wadi-store-cart'

const StoreContext = createContext(null)

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState(readCart)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('https://fakestoreapi.com/products')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      })
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e.message || 'Network error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* ignore */
    }
  }, [cart])

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.id === product.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], quantity: next[i].quantity + qty }
        return next
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: qty,
        },
      ]
    })
    setCartOpen(true)
  }, [])

  const updateQty = useCallback((id, quantity) => {
    setCart((prev) => {
      if (quantity < 1) return prev.filter((l) => l.id !== id)
      return prev.map((l) => (l.id === id ? { ...l, quantity } : l))
    })
  }, [])

  const removeLine = useCallback((id) => {
    setCart((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const subtotal = useMemo(
    () => cart.reduce((s, l) => s + l.price * l.quantity, 0),
    [cart]
  )

  const categoryList = useMemo(() => {
    const s = new Set()
    products.forEach((p) => s.add(p.category))
    return Array.from(s).sort()
  }, [products])

  const filteredBySearch = useCallback(
    (list) => {
      const q = searchQuery.trim().toLowerCase()
      if (!q) return list
      return list.filter((p) => p.title.toLowerCase().includes(q))
    },
    [searchQuery]
  )

  const value = {
    products,
    loading,
    loadError,
    searchQuery,
    setSearchQuery,
    categoryList,
    filteredBySearch,
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQty,
    removeLine,
    clearCart,
    subtotal,
    cartCount: cart.reduce((n, l) => n + l.quantity, 0),
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const c = useContext(StoreContext)
  if (!c) throw new Error('useStore must be used under StoreProvider')
  return c
}
