import { DEFAULT_PAYMENT_METHOD_ID, FALLBACK_KIOSCO_ID, OWNER_AUTH_ID } from './commerce'
import { createSupabaseAdmin } from './supabase-server'

export type Product = {
  id: number
  tipo: string
  codigo: string | null
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  puntos: number
  imagen_url: string | null
}

export type Commerce = {
  id: string
  nombre: string
  telefono: string | null
  direccion: string | null
  sistema_puntos_activo: boolean
}

export type CartInputItem = {
  productId: number
  quantity: number
}

export async function getCommerce() {
  const supabase = await createSupabaseAdmin()

  const directId = process.env.NEXT_PUBLIC_KIOSCO_ID ?? process.env.KIOSCO_ID
  if (directId) {
    const { data, error } = await supabase
      .from('kioscos')
      .select('id,nombre,telefono,direccion,sistema_puntos_activo')
      .eq('id', directId)
      .single()

    if (!error && data) return data as Commerce
  }

  const { data, error } = await supabase
    .from('kioscos')
    .select('id,nombre,telefono,direccion,sistema_puntos_activo')
    .eq('owner_auth_id', OWNER_AUTH_ID)
    .single()

  if (error) {
    return {
      id: FALLBACK_KIOSCO_ID,
      nombre: 'Occhio Optica',
      telefono: '+54 9 11 0000-0000',
      direccion: 'Av. Corrientes 1234, Buenos Aires',
      sistema_puntos_activo: true,
    } satisfies Commerce
  }

  return data as Commerce
}

export async function listProducts(limit = 48) {
  const commerce = await getCommerce()
  const supabase = await createSupabaseAdmin()
  const { data, error } = await supabase
    .from('producto')
    .select('id,tipo,codigo,nombre,descripcion,precio,stock,puntos,imagen_url')
    .eq('kiosco_id', commerce.id)
    .eq('deleted', false)
    .gt('stock', 0)
    .order('nombre', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as Product[]
}

export async function getProduct(id: number) {
  const commerce = await getCommerce()
  const supabase = await createSupabaseAdmin()
  const { data, error } = await supabase
    .from('producto')
    .select('id,tipo,codigo,nombre,descripcion,precio,stock,puntos,imagen_url')
    .eq('kiosco_id', commerce.id)
    .eq('deleted', false)
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data as Product
}

export async function getProductsByIds(ids: number[]) {
  if (!ids.length) {
    return []
  }

  const commerce = await getCommerce()
  const supabase = await createSupabaseAdmin()
  const { data, error } = await supabase
    .from('producto')
    .select('id,tipo,codigo,nombre,descripcion,precio,stock,puntos,imagen_url')
    .eq('kiosco_id', commerce.id)
    .eq('deleted', false)
    .in('id', ids)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as Product[]
}

export async function checkoutOrder(input: {
  items: CartInputItem[]
  customer: {
    nombre: string
    apellido?: string
    email: string
    telefono?: string
  }
}) {
  const commerce = await getCommerce()
  const supabase = await createSupabaseAdmin()
  const { data, error } = await supabase.rpc('ecommerce_checkout', {
    p_kiosco_id: commerce.id,
    p_payment_method_id: DEFAULT_PAYMENT_METHOD_ID,
    payload: input,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
