import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { CartDrawer } from './CartDrawer'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-mud text-cream' : 'text-mud/80 hover:bg-mud/5 hover:text-mud'
  }`

export function Layout({ children }) {
  const { searchQuery, setSearchQuery, setCartOpen, cartCount } = useStore()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const navigate = useNavigate()

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const submitSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localSearch)
    setMobileMenu(false)
    navigate('/products')
  }

  return (
    <div className="min-h-screen bg-cream text-mud">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-sand focus:px-4 focus:py-2 focus:text-mud"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-mud/10 bg-paper/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="shrink-0 font-display text-xl font-semibold tracking-tight text-mud md:text-2xl">
            Wadi<span className="text-sand">.</span>
          </Link>

          <form onSubmit={submitSearch} className="mx-auto hidden min-w-0 max-w-md flex-1 sm:block">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <input
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value)
                  setSearchQuery(e.target.value)
                }}
                type="search"
                placeholder="Search the souq…"
                className="w-full rounded-full border border-mud/10 bg-cream/80 py-2 pl-4 pr-4 text-sm text-mud shadow-inner placeholder:text-mud/40 focus:border-sand focus:outline-none focus:ring-2 focus:ring-sand/30"
              />
            </label>
          </form>

          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setMobileMenu((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-mud md:hidden"
              aria-expanded={mobileMenu}
              aria-label="Open menu"
            >
              {mobileMenu ? '✕' : '☰'}
            </button>
            <div
              className={`absolute left-0 right-0 top-full z-30 border-b border-mud/10 bg-paper p-4 shadow md:static md:flex md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
                mobileMenu ? 'flex flex-col' : 'hidden md:flex'
              }`}
            >
              <form onSubmit={submitSearch} className="mb-3 sm:hidden">
                <input
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value)
                    setSearchQuery(e.target.value)
                  }}
                  type="search"
                  placeholder="Search products…"
                  className="w-full rounded-full border border-mud/10 bg-cream py-2 px-3 text-sm"
                />
              </form>
              <NavLink to="/" className={linkClass} end onClick={() => setMobileMenu(false)}>
                Home
              </NavLink>
              <NavLink to="/products" className={linkClass} onClick={() => setMobileMenu(false)}>
                Shop
              </NavLink>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-mud/10 bg-cream/80 text-lg transition hover:border-sand hover:bg-sand/10"
              aria-label="Open cart"
            >
              <span aria-hidden>🧺</span>
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-sand px-0.5 text-[10px] font-bold text-mud">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="mt-20 border-t border-mud/10 bg-mud text-cream/90">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-cream">Wadi Store</p>
              <p className="mt-1 max-w-sm text-sm text-cream/70">
                A Jordanian shop for handmade and curated pieces — warm craft, fair prices, worldwide shipping.
              </p>
            </div>
            <div className="text-sm text-cream/70">
              <p>Amman · Online</p>
              <a href="mailto:hello@wadistore.example" className="mt-1 block text-sand-light hover:underline">
                hello@wadistore.example
              </a>
            </div>
          </div>
          <p className="mt-10 text-center text-xs text-cream/40">© 2026 Wadi Store. Demo storefront — products via Fake Store API.</p>
        </div>
      </footer>
      <CartDrawer />
    </div>
  )
}
