export const OWNER_AUTH_ID =
  process.env.NEXT_PUBLIC_COMMERCE_OWNER_AUTH_ID ??
  process.env.COMMERCE_OWNER_AUTH_ID ??
  '77851826-3bd5-452f-bd99-c20d78124e64'

export const FALLBACK_KIOSCO_ID =
  process.env.NEXT_PUBLIC_KIOSCO_ID ??
  process.env.KIOSCO_ID ??
  '573c9044-3174-4615-9f33-663c5a2ea4d8'

export const DEFAULT_PAYMENT_METHOD_ID =
  process.env.ECOMMERCE_DEFAULT_PAYMENT_METHOD_ID ?? 'DEFAULT_PENDIENTE'

export const CUSTOMER_LEVELS = [
  { level: 1, name: 'Nuevo', minPoints: 0, discountPercent: 0 },
  { level: 2, name: 'Cliente', minPoints: 100, discountPercent: 3 },
  { level: 3, name: 'Frecuente', minPoints: 300, discountPercent: 5 },
  { level: 4, name: 'Premium', minPoints: 800, discountPercent: 8 },
  { level: 5, name: 'VIP', minPoints: 1500, discountPercent: 12 },
] as const

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getCustomerLevel(points: number) {
  return [...CUSTOMER_LEVELS]
    .reverse()
    .find((level) => points >= level.minPoints) ?? CUSTOMER_LEVELS[0]
}
