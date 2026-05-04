import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'itappens.ai - Never Lose Track of Your Invoices',
  description: 'Know exactly who owes you and get paid faster. Join thousands using itappens to manage their invoices effortlessly.',
  keywords: ['invoices', 'payment tracking', 'small business', 'invoicing'],
  openGraph: {
    title: 'itappens.ai - Never Lose Track of Your Invoices',
    description: 'Know exactly who owes you and get paid faster.',
    type: 'website',
    url: 'https://itappens.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'itappens.ai - Never Lose Track of Your Invoices',
    description: 'Know exactly who owes you and get paid faster.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
