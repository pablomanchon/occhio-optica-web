import '../styles/globals.css'
import type { Metadata } from 'next'
import FloatingCart from './components/FloatingCart'

export const metadata: Metadata = {
  title: 'Occhio Optica Web',
  description: 'Anteojos, cristales y controles visuales con estilo editorial.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <FloatingCart />
      </body>
    </html>
  )
}
