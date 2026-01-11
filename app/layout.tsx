export const metadata = {
  title: 'AI Web',
  description: 'Groq Chat + Image Generation',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
