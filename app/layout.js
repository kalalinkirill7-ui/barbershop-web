import './globals.css'
import Header from '@/components/Header'
import LightboxProvider from '@/components/LightboxProvider'

export const metadata = {
  title: 'Брутальный Барбершоп',
  description: 'Лучшие стрижки в городе',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className="dark">
      <body className="min-h-screen flex flex-col">
        <LightboxProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} BRUTAL Barbershop
          </footer>
        </LightboxProvider>
      </body>
    </html>
  )
}
