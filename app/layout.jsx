import './globals.css'

export const metadata = {
  title: 'C³ Studio - Kreatives Kollektiv',
  description: 'Ein multidisziplinäres kreatives Kollektiv, das Film, Web und Content vereint',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bungee&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
