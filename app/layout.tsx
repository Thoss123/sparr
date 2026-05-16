import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sparr — Dein proaktiver KI-Business-Coach',
  description:
    'Sparr analysiert täglich deine Deals und nennt dir morgens um 8:00 Uhr exakt die 3 Aktionen, die heute Umsatz bringen. Für Webdesigner, Marketer & Solopreneure.',
  openGraph: {
    title: 'Sparr — Dein proaktiver KI-Business-Coach',
    description:
      'Hör auf, To-Dos abzuarbeiten. Fang an, Deals zu closen. Sparr gibt dir jeden Morgen 3 konkrete Prioritäten — Umsatz zuerst.',
    locale: 'de_AT',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#fafafa] text-slate-900 font-sans">{children}</body>
    </html>
  )
}
