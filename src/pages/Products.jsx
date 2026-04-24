import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export function Products() {
  const { products, loading, loadError, categoryList, filteredBySearch, searchQuery } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('default')

  useEffect(() => {
    const fromSession = sessionStorage.getItem('wadi-category')
    if (fromSession) {
      setCat(fromSession)
      sessionStorage.removeItem('wadi-category')
    }
  }, [])

  const list = useMemo(() => {
    let base = filteredBySearch(products)
    if (cat !== 'all') base = base.filter((p) => p.category === cat)
    const next = [...base]
    if (sort === 'price-asc') next.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') next.sort((a, b) => b.price - a.price)
    return next
  }, [products, cat, sort, filteredBySearch])

  useEffect(() => {
    const c = searchParams.get('category')
    if (c) setCat(c)
  }, [searchParams])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-semibold text-mud">The souq</h1>
      <p className="mt-1 text-mud/55">Every listing ships from our demo API — 16+ items, filters, and search.</p>

      {searchQuery ? (
        <p className="mt-2 text-sm text-sand">
          Filtered by search: <span className="font-medium text-mud">&ldquo;{searchQuery}&rdquo;</span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="sm:mr-4">
          <label htmlFor="cat" className="text-xs font-medium uppercase tracking-wider text-mud/50">
            Category
          </label>
          <select
            id="cat"
            value={cat}
            onChange={(e) => {
              setCat(e.target.value)
              if (e.target.value === 'all') {
                setSearchParams({})
              } else {
                setSearchParams({ category: e.target.value })
              }
            }}
            className="mt-1 block w-full min-w-[12rem] rounded-xl border border-mud/12 bg-paper py-2 pl-3 pr-8 text-sm text-mud focus:border-sand focus:outline-none focus:ring-2 focus:ring-sand/20 sm:w-auto"
          >
            <option value="all">All categories</option>
            {categoryList.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="text-xs font-medium uppercase tracking-wider text-mud/50">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-1 block w-full min-w-[12rem] rounded-xl border border-mud/12 bg-paper py-2 pl-3 pr-8 text-sm text-mud focus:border-sand focus:outline-none focus:ring-2 focus:ring-sand/20 sm:w-auto"
          >
            <option value="default">Default (API order)</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <p className="text-sm text-mud/45 sm:ml-auto">{list.length} products</p>
      </div>

      {loading && <p className="mt-12 text-center text-mud/50">Loading the souq…</p>}
      {loadError && <p className="mt-12 text-center text-rose-700">{loadError}</p>}

      {!loading && !loadError && (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <li key={p.id}>
              <Link
                to={`/product/${p.id}`}
                className="group block overflow-hidden rounded-2xl border border-mud/8 bg-paper shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-cream">
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-contain p-4 transition group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-mud/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cream">
                    {p.category}
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-mud">{p.title}</h2>
                  <p className="mt-1 text-lg font-semibold text-sand">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
