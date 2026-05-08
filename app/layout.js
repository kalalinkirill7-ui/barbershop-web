import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Брутальный Барбершоп',
  description: 'Лучшие стрижки в городе',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="bg-stone-50">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-800 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} BRUTAL Barbershop. Все права защищены.
        </footer>
      </body>
    </html>
  )
}
