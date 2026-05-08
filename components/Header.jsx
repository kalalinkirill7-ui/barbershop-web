'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname.startsWith('/admin')
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href={isAdmin ? '/admin' : '/'} className="text-xl font-bold tracking-tight text-stone-800">
          {isAdmin ? 'АДМИНКА' : 'ГЛАВНАЯ'}
        </Link>

        {/* Десктоп-меню */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="text-stone-500 hover:text-stone-900">Услуги</Link>
              <Link href="/admin/barbers" className="text-stone-500 hover:text-stone-900">Мастера</Link>
              <Link href="/admin/appointments" className="text-stone-500 hover:text-stone-900">Записи</Link>
              <Link href="/admin/content" className="text-stone-500 hover:text-stone-900">Контент</Link>
              <Link href="/admin/gallery" className="text-stone-500 hover:text-stone-900">Галерея</Link>
              <Link href="/admin/reviews" className="text-stone-500 hover:text-stone-900">Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="bg-amber-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-amber-400 transition shadow-md">Запись</Link>
              <Link href="/my-bookings" className="text-stone-500 hover:text-stone-900">Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-stone-500 hover:text-stone-900">{user.user_metadata?.name || user.email}</Link>
                  <button onClick={handleLogout} className="text-red-400 hover:underline text-sm">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-stone-500 hover:text-stone-900">Войти</Link>
                  <Link href="/register" className="text-stone-500 hover:text-stone-900">Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Гамбургер — с отступами */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-stone-600 hover:text-stone-900 p-3 -mr-2">
          {menuOpen ? <X size={28} /> : <Menu size={28} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-stone-200 px-5 py-5 flex flex-col gap-4 text-lg font-medium">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Услуги</Link>
              <Link href="/admin/barbers" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Мастера</Link>
              <Link href="/admin/appointments" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Записи</Link>
              <Link href="/admin/content" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Контент</Link>
              <Link href="/admin/gallery" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Галерея</Link>
              <Link href="/admin/reviews" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="bg-amber-500 text-white text-center py-3 rounded-full font-semibold shadow-md" onClick={() => setMenuOpen(false)}>Записаться онлайн</Link>
              <Link href="/my-bookings" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>{user.user_metadata?.name || user.email}</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-red-400 text-left py-1">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Войти</Link>
                  <Link href="/register" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  )
}
EOFcat > /Users/mac/projects/barbershop-web/components/Header.jsx << 'EOF'
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname.startsWith('/admin')
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link href={isAdmin ? '/admin' : '/'} className="text-xl font-bold tracking-tight text-stone-800">
          {isAdmin ? 'АДМИНКА' : 'ГЛАВНАЯ'}
        </Link>

        {/* Десктоп-меню */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="text-stone-500 hover:text-stone-900">Услуги</Link>
              <Link href="/admin/barbers" className="text-stone-500 hover:text-stone-900">Мастера</Link>
              <Link href="/admin/appointments" className="text-stone-500 hover:text-stone-900">Записи</Link>
              <Link href="/admin/content" className="text-stone-500 hover:text-stone-900">Контент</Link>
              <Link href="/admin/gallery" className="text-stone-500 hover:text-stone-900">Галерея</Link>
              <Link href="/admin/reviews" className="text-stone-500 hover:text-stone-900">Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="bg-amber-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-amber-400 transition shadow-md">Запись</Link>
              <Link href="/my-bookings" className="text-stone-500 hover:text-stone-900">Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-stone-500 hover:text-stone-900">{user.user_metadata?.name || user.email}</Link>
                  <button onClick={handleLogout} className="text-red-400 hover:underline text-sm">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-stone-500 hover:text-stone-900">Войти</Link>
                  <Link href="/register" className="text-stone-500 hover:text-stone-900">Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Гамбургер — с отступами */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-stone-600 hover:text-stone-900 p-3 -mr-2">
          {menuOpen ? <X size={28} /> : <Menu size={28} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-stone-200 px-5 py-5 flex flex-col gap-4 text-lg font-medium">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Услуги</Link>
              <Link href="/admin/barbers" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Мастера</Link>
              <Link href="/admin/appointments" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Записи</Link>
              <Link href="/admin/content" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Контент</Link>
              <Link href="/admin/gallery" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Галерея</Link>
              <Link href="/admin/reviews" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="bg-amber-500 text-white text-center py-3 rounded-full font-semibold shadow-md" onClick={() => setMenuOpen(false)}>Записаться онлайн</Link>
              <Link href="/my-bookings" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>{user.user_metadata?.name || user.email}</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-red-400 text-left py-1">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Войти</Link>
                  <Link href="/register" className="text-stone-600 py-1" onClick={() => setMenuOpen(false)}>Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  )
}
