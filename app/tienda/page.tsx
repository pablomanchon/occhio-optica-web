import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import { getCommerce, listProducts } from '../../lib/store'

export const dynamic = 'force-dynamic'

export default async function StorePage() {
  const [commerce, products] = await Promise.all([getCommerce(), listProducts()])

  return (
    <main className="store-shell">
      <header className="store-header">
        <Link className="store-logo" href="/">
          occhio
        </Link>
        <nav>
          <Link href="/">Inicio</Link>
          <Link href="/tienda">Tienda</Link>
          <Link href="/carrito">Carrito</Link>
        </nav>
      </header>

      <section className="store-hero">
        <div className="store-hero-copy">
          <p>{commerce.nombre}</p>
          <h1>Anteojos, sol y accesorios listos para elegir.</h1>
          <span>
            {commerce.direccion ?? 'Tienda online con stock y precios en tiempo real.'}
          </span>
        </div>
        <div className="store-hero-art" aria-hidden="true">
          <span />
          <strong>occhio</strong>
        </div>
      </section>

      <section className="store-toolbar" aria-label="Resumen de tienda">
        <div>
          <strong>{products.length}</strong>
          <span>productos disponibles</span>
        </div>
        <div>
          <strong>{commerce.sistema_puntos_activo ? 'Activo' : 'No activo'}</strong>
          <span>sistema de puntos</span>
        </div>
        <Link href="/carrito">Ver carrito</Link>
      </section>

      {products.length ? (
        <section className="store-grid" aria-label="Productos">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="store-empty">
          <h2>No hay productos disponibles</h2>
          <p>El catalogo esta conectado a Supabase, pero no hay stock activo para mostrar.</p>
        </section>
      )}
    </main>
  )
}
