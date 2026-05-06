import Link from 'next/link'
import { formatCurrency } from '../../lib/commerce'
import { Product } from '../../lib/store'
import AddToCartButton from './AddToCartButton'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="store-card">
      <Link className="store-card-media" href={`/productos/${product.id}`}>
        <span>{product.nombre.slice(0, 2).toUpperCase()}</span>
      </Link>
      <div className="store-card-body">
        <p>{product.tipo}</p>
        <h3>
          <Link href={`/productos/${product.id}`}>{product.nombre}</Link>
        </h3>
        <strong>{formatCurrency(Number(product.precio))}</strong>
        <small>
          Stock: {product.stock} {product.puntos > 0 ? `- ${product.puntos} pts` : ''}
        </small>
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </article>
  )
}
