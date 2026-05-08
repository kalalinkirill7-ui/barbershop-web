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
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-zinc-800 py-3 px-4 bg-zinc-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href={isAdmin ? '/admin' : '/'}
          className="text-xl font-black uppercase text-amber-500 tracking-wider"
        >
          {isAdmin ? 'АДМИНКА' : 'ГЛАВНАЯ'}
        </Link>

        {/* Кнопка гамбургера для мобильных */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="md:hidden text-zinc-400 hover:text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Навигация для десктопа */}
        <nav className="hidden md:flex gap-5 text-sm font-medium items-center">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="text-zinc-400 hover:text-amber-400 transition">Услуги</Link>
              <Link href="/admin/barbers" className="text-zinc-400 hover:text-amber-400 transition">Мастера</Link>
              <Link href="/admin/appointments" className="text-zinc-400 hover:text-amber-400 transition">Записи</Link>
              <Link href="/admin/content" className="text-zinc-400 hover:text-amber-400 transition">Контент</Link>
              <Link href="/admin/gallery" className="text-zinc-400 hover:text-amber-400 transition">Галерея</Link>
              <Link href="/admin/reviews" className="text-zinc-400 hover:text-amber-400 transition">Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="text-zinc-400 hover:text-amber-400 transition">Запись</Link>
              <Link href="/my-bookings" className="text-zinc-400 hover:text-amber-400 transition">Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-amber-400 hover:underline">
                    {user.user_metadata?.name || user.email}
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 hover:underline">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-zinc-400 hover:text-amber-400 transition">Войти</Link>
                  <Link href="/register" className="text-zinc-400 hover:text-amber-400 transition">Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <nav className="md:hidden mt-3 flex flex-col gap-3 pb-2 border-t border-zinc-800 pt-3 text-sm font-medium">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Услуги</Link>
              <Link href="/admin/barbers" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Мастера</Link>
              <Link href="/admin/appointments" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Записи</Link>
              <Link href="/admin/content" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Контент</Link>
              <Link href="/admin/gallery" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Галерея</Link>
              <Link href="/admin/reviews" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Запись</Link>
              <Link href="/my-bookings" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-amber-400 hover:underline" onClick={() => setMenuOpen(false)}>
                    {user.user_metadata?.name || user.email}
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-400 hover:underline text-left">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Войти</Link>
                  <Link href="/register" className="text-zinc-400 hover:text-amber-400 transition" onClick={() => setMenuOpen(false)}>Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  )
}
