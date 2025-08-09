import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

const siteUrl = 'https://pet-giveaway-gr.vercel.app' // just root URL

export const metadata: Metadata = {
  title: 'Pet Transferer',
  description: 'Created by hesarq',
  generator: 'v0.dev',
  openGraph: {
    title: 'Pet Transferer',
    description: 'Created by hesarq',
    images: [`${siteUrl}/thumbnail.png?v=2`], // absolute URL with cache busting
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content={`${siteUrl}/thumbnail.png?v=2`} />
        <meta name="twitter:image" content={`${siteUrl}/thumbnail.png?v=2`} />
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
