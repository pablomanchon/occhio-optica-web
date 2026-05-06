import Link from 'next/link'
import CartClient from '../components/CartClient'

export default function CartPage() {
  return (
    <main className="store-shell">
      <header className="store-header">
        <Link className="store-logo" href="/">
          occhio
        </Link>
        <nav>
          <Link href="/tienda">Tienda</Link>
          <Link href="/carrito">Carrito</Link>
        </nav>
      </header>
      <CartClient />
    </main>
  )
}
