'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { formatCurrency } from '../../lib/commerce'
import { Product } from '../../lib/store'

type CartItem = {
  productId: number
  quantity: number
}

type CheckoutResult = {
  ok: boolean
  orderId?: number
  total?: number
  pointsEarned?: number
  error?: string
}

const CART_KEY = 'occhio-cart'

export default function CartClient() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<CheckoutResult | null>(null)

  useEffect(() => {
    const readCart = () => {
      setCart(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'))
    }

    readCart()
    window.addEventListener('occhio-cart-change', readCart)
    return () => window.removeEventListener('occhio-cart-change', readCart)
  }, [])

  useEffect(() => {
    const ids = cart.map((item) => item.productId)

    if (!ids.length) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false))
  }, [cart])

  const lines = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((entry) => entry.id === item.productId)
          return product ? { ...item, product } : null
        })
        .filter(Boolean) as Array<CartItem & { product: Product }>,
    [cart, products],
  )

  const subtotal = lines.reduce(
    (total, item) => total + Number(item.product.precio) * item.quantity,
    0,
  )

  const updateQuantity = (productId: number, quantity: number) => {
    const next = cart
      .map((item) => (item.productId === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0)

    setCart(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }

  const checkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setResult(null)

    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        customer: {
          nombre: form.get('nombre'),
          apellido: form.get('apellido'),
          email: form.get('email'),
          telefono: form.get('telefono'),
        },
      }),
    })
    const data = (await response.json()) as CheckoutResult

    setSubmitting(false)
    setResult(data)

    if (response.ok && data.ok) {
      setCart([])
      localStorage.removeItem(CART_KEY)
      window.dispatchEvent(new Event('occhio-cart-change'))
    }
  }

  if (loading) {
    return <p className="store-state">Cargando carrito...</p>
  }

  if (!lines.length) {
    return (
      <div className="store-empty">
        <h1>Tu carrito esta vacio</h1>
        <p>Elegí productos reales del catálogo de Occhio y volvé para finalizar.</p>
        <Link className="dark-button" href="/tienda">
          Ver tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-layout">
      <section className="cart-lines">
        <h1>Carrito</h1>
        {lines.map((item) => (
          <article className="cart-line" key={item.productId}>
            <div>
              <h2>{item.product.nombre}</h2>
              <p>{formatCurrency(Number(item.product.precio))}</p>
              <small>Stock disponible: {item.product.stock}</small>
            </div>
            <input
              aria-label={`Cantidad de ${item.product.nombre}`}
              min={0}
              max={item.product.stock}
              type="number"
              value={item.quantity}
              onChange={(event) =>
                updateQuantity(item.productId, Number(event.currentTarget.value))
              }
            />
          </article>
        ))}
      </section>

      <form className="checkout-box" onSubmit={checkout}>
        <h2>Checkout</h2>
        <label>
          Nombre
          <input name="nombre" required minLength={2} />
        </label>
        <label>
          Apellido
          <input name="apellido" />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Teléfono
          <input name="telefono" />
        </label>
        <div className="checkout-total">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <p>
          El total, stock y puntos se recalculan en el servidor antes de crear la
          compra.
        </p>
        <button className="shop-button" disabled={submitting} type="submit">
          {submitting ? 'Confirmando...' : 'Confirmar compra'}
        </button>
        {result?.ok && (
          <p className="checkout-success">
            Compra #{result.orderId} creada. Ganaste {result.pointsEarned ?? 0} puntos.
          </p>
        )}
        {result?.error && <p className="checkout-error">{result.error}</p>}
      </form>
    </div>
  )
}
