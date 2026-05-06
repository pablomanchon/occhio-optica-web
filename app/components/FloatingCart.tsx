'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { formatCurrency } from '../../lib/commerce'

type CartItem = { productId: number; quantity: number }
type Product = { id: number; nombre: string; precio: number }
type FlyDot = { id: number; startX: number; startY: number; endX: number; endY: number }

const CART_KEY = 'occhio-cart'

export default function FloatingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [flyDots, setFlyDots] = useState<FlyDot[]>([])
  const [bumpTick, setBumpTick] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const total = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product ? Number(product.precio) * item.quantity : 0)
  }, 0)

  const readCart = useCallback(() => {
    const items = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[]
    setCartItems(items)
    return items
  }, [])

  const fetchProducts = useCallback(async (items: CartItem[]) => {
    if (!items.length) {
      setProducts([])
      return
    }
    const ids = items.map((i) => i.productId).join(',')
    try {
      const res = await fetch(`/api/products?ids=${ids}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products ?? [])
      }
    } catch {}
  }, [])

  useEffect(() => {
    const items = readCart()
    fetchProducts(items)

    const onCartChange = () => {
      const updated = readCart()
      fetchProducts(updated)
      setBumpTick((t) => t + 1)
    }

    const onFly = (e: Event) => {
      const { x: startX, y: startY } = (e as CustomEvent<{ x: number; y: number }>).detail
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const endX = rect.left + rect.width / 2
      const endY = rect.top + rect.height / 2
      const id = Date.now() + Math.random()
      setFlyDots((prev) => [...prev, { id, startX, startY, endX, endY }])
      setTimeout(() => setFlyDots((prev) => prev.filter((d) => d.id !== id)), 750)
    }

    window.addEventListener('occhio-cart-change', onCartChange)
    window.addEventListener('occhio-cart-fly', onFly)
    return () => {
      window.removeEventListener('occhio-cart-change', onCartChange)
      window.removeEventListener('occhio-cart-fly', onFly)
    }
  }, [readCart, fetchProducts])

  // Trigger bump animation without remounting the button (preserves the ref)
  useEffect(() => {
    if (bumpTick === 0) return
    const btn = buttonRef.current
    if (!btn) return
    btn.classList.remove('cart-float-bump')
    void btn.offsetHeight
    btn.classList.add('cart-float-bump')
    const t = setTimeout(() => btn.classList.remove('cart-float-bump'), 420)
    return () => clearTimeout(t)
  }, [bumpTick])

  return (
    <>
      {flyDots.map((dot) => (
        <div
          key={dot.id}
          className="cart-fly-dot"
          style={
            {
              left: dot.startX - 6,
              top: dot.startY - 6,
              '--fly-dx': `${dot.endX - dot.startX}px`,
              '--fly-dy': `${dot.endY - dot.startY}px`,
            } as React.CSSProperties
          }
        />
      ))}

      {isOpen && (
        <div className="cart-drawer-overlay" onClick={() => setIsOpen(false)} />
      )}

      <div className={`cart-drawer${isOpen ? ' cart-drawer-open' : ''}`}>
        <div className="cart-drawer-header">
          <span>Carrito</span>
          <button className="cart-drawer-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="cart-drawer-empty">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="cart-drawer-list">
              {cartItems.map((item) => {
                const product = products.find((p) => p.id === item.productId)
                return (
                  <li key={item.productId} className="cart-drawer-item">
                    <span className="cart-drawer-item-name">
                      {product?.nombre ?? `Producto #${item.productId}`}
                    </span>
                    <span className="cart-drawer-item-qty">×{item.quantity}</span>
                  </li>
                )
              })}
            </ul>
            {total > 0 && (
              <div className="cart-drawer-total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            )}
          </>
        )}

        <Link
          href="/carrito"
          className="cart-drawer-cta"
          onClick={() => setIsOpen(false)}
        >
          Ver carrito completo
        </Link>
      </div>

      <button
        ref={buttonRef}
        className="cart-float-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Carrito, ${totalItems} artículos`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {totalItems > 0 && (
          <span key={totalItems} className="cart-float-badge">
            {totalItems}
          </span>
        )}
      </button>
    </>
  )
}
