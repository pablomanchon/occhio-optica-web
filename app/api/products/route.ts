import { NextResponse } from 'next/server'
import { getProductsByIds } from '../../../lib/store'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ids = (searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0)

  try {
    const products = await getProductsByIds([...new Set(ids)])
    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudieron cargar productos' },
      { status: 500 },
    )
  }
}
