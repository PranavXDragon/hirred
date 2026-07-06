import type { Metadata } from 'next'
import "./globals.css";
 
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'HIRRD',
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="overflow-x-hidden">
        <div id="root">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
