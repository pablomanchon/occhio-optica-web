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
        <p>Catálogo real de {commerce.nombre}</p>
        <h1>Comprar anteojos y accesorios en Occhio</h1>
        <span>
          Mostrando únicamente productos del comercio asociado a{' '}
          <strong>{commerce.id}</strong>.
        </span>
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
          <p>El catálogo está conectado a Supabase, pero no hay stock activo para mostrar.</p>
        </section>
      )}
    </main>
  )
}
