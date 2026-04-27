'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname.startsWith('/admin')
  const [user, setUser] = useState(null)

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
    <header className="border-b border-zinc-800 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href={isAdmin ? '/admin' : '/'}
          className="text-2xl font-black uppercase text-amber-500 tracking-wider"
        >
          {isAdmin ? 'АДМИНКА' : 'ГЛАВНАЯ'}
        </Link>
        <nav className="flex gap-6 text-sm font-medium items-center">
          {isAdmin ? (
            <>
              <Link href="/admin/services" className="hover:text-amber-400">Услуги</Link>
              <Link href="/admin/barbers" className="hover:text-amber-400">Мастера</Link>
              <Link href="/admin/appointments" className="hover:text-amber-400">Записи</Link>
              <Link href="/admin/content" className="hover:text-amber-400">Контент</Link>
              <Link href="/admin/gallery" className="hover:text-amber-400">Галерея</Link>
              <Link href="/admin/reviews" className="hover:text-amber-400">Отзывы</Link>
            </>
          ) : (
            <>
              <Link href="/booking" className="hover:text-amber-400">Запись</Link>
              <Link href="/my-bookings" className="hover:text-amber-400">Мои записи</Link>
              {user ? (
                <>
                  <Link href="/profile" className="text-amber-400 hover:underline">
                    {user.user_metadata?.name || user.email}
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 hover:underline">Выйти</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-amber-400">Войти</Link>
                  <Link href="/register" className="hover:text-amber-400">Регистрация</Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
