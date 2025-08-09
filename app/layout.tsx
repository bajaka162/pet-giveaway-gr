import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pet Transferer',
  description: 'Created by hesarq',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>

        {/* Thumbnail for previews with cache-busting */}
        <meta property="og:image" content="/thumbnail.png?v=2" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pet Transferer" />
        <meta property="og:description" content="Created by hesarq" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pet Transferer" />
        <meta name="twitter:description" content="Created by hesarq" />
        <meta name="twitter:image" content="/thumbnail.png?v=2" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
