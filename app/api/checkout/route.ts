import { NextResponse } from 'next/server'
import { checkoutOrder } from '../../../lib/store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body.items) ? body.items : []
    const customer = body.customer ?? {}

    const normalizedItems = items.map((item: { productId: unknown; quantity: unknown }) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }))

    if (!normalizedItems.length) {
      return NextResponse.json({ ok: false, error: 'El carrito está vacío' }, { status: 400 })
    }

    if (!customer.nombre || !customer.email) {
      return NextResponse.json(
        { ok: false, error: 'Nombre y email son obligatorios' },
        { status: 400 },
      )
    }

    const result = await checkoutOrder({
      items: normalizedItems,
      customer: {
        nombre: String(customer.nombre),
        apellido: customer.apellido ? String(customer.apellido) : '',
        email: String(customer.email),
        telefono: customer.telefono ? String(customer.telefono) : '',
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'No se pudo crear la compra' },
      { status: 400 },
    )
  }
}
