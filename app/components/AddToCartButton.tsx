'use client'

import { useState, useRef } from 'react'

type AddToCartButtonProps = {
  productId: number
  stock: number
}

type CartItem = {
  productId: number
  quantity: number
}

const CART_KEY = 'occhio-cart'

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const addToCart = () => {
    const current = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[]
    const existing = current.find((item) => item.productId === productId)

    if (existing) {
      existing.quantity = Math.min(stock, existing.quantity + 1)
    } else {
      current.push({ productId, quantity: 1 })
    }

    localStorage.setItem(CART_KEY, JSON.stringify(current))

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      window.dispatchEvent(
        new CustomEvent('occhio-cart-fly', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        })
      )
    }

    window.dispatchEvent(new Event('occhio-cart-change'))
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <button
      ref={buttonRef}
      className="shop-button"
      type="button"
      onClick={addToCart}
      disabled={stock <= 0}
    >
      {stock <= 0 ? 'Sin stock' : added ? 'Agregado ✓' : 'Agregar al carrito'}
    </button>
  )
}
