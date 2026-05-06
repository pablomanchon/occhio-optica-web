import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCartButton from '../../components/AddToCartButton'
import { formatCurrency } from '../../../lib/commerce'
import { getProduct } from '../../../lib/store'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  if (!Number.isInteger(id)) {
    notFound()
  }

  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

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

      <section className="product-detail">
        <div className="product-detail-media">
          <span>{product.nombre.slice(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <p>{product.tipo}</p>
          <h1>{product.nombre}</h1>
          <strong>{formatCurrency(Number(product.precio))}</strong>
          <p>{product.descripcion || 'Producto disponible en Occhio.'}</p>
          <ul>
            <li>Stock real: {product.stock}</li>
            <li>Código: {product.codigo ?? 'Sin código'}</li>
            <li>Puntos por unidad: {product.puntos}</li>
          </ul>
          <AddToCartButton productId={product.id} stock={product.stock} />
        </div>
      </section>
    </main>
  )
}
