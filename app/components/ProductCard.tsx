import Link from 'next/link'
import { formatCurrency } from '../../lib/commerce'
import { Product } from '../../lib/store'
import AddToCartButton from './AddToCartButton'

export default function ProductCard({ product }: { product: Product }) {
  const isLowStock = product.stock <= 5

  return (
    <article className="store-card">
      <Link
        className={`store-card-media${product.imagen_url ? ' has-image' : ''}`}
        href={`/productos/${product.id}`}
      >
        <em>{product.tipo}</em>
        {product.imagen_url ? (
          <img src={product.imagen_url} alt={product.nombre} />
        ) : (
          <span>{product.nombre.slice(0, 2).toUpperCase()}</span>
        )}
      </Link>
      <div className="store-card-body">
        <div className="store-card-meta">
          <p>{product.codigo ?? 'Sin codigo'}</p>
          {product.puntos > 0 && <span>{product.puntos} pts</span>}
        </div>
        <h3>
          <Link href={`/productos/${product.id}`}>{product.nombre}</Link>
        </h3>
        <strong>{formatCurrency(Number(product.precio))}</strong>
        <small className={isLowStock ? 'stock-badge stock-low' : 'stock-badge'}>
          {isLowStock ? `Ultimas ${product.stock} unidades` : `${product.stock} en stock`}
        </small>
        <AddToCartButton productId={product.id} stock={product.stock} />
      </div>
    </article>
  )
}
