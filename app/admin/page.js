'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/admin/login')
    })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/services" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition">
          <p className="text-2xl mb-1">💇</p><p className="font-semibold">Услуги</p>
        </Link>
        <Link href="/admin/barbers" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition">
          <p className="text-2xl mb-1">💈</p><p className="font-semibold">Мастера</p>
        </Link>
        <Link href="/admin/appointments" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition">
          <p className="text-2xl mb-1">📅</p><p className="font-semibold">Записи</p>
        </Link>
        <Link href="/admin/content" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition">
          <p className="text-2xl mb-1">📝</p><p className="font-semibold">Контент</p>
        </Link>
        <Link href="/admin/gallery" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition">
          <p className="text-2xl mb-1">🖼️</p><p className="font-semibold">Галерея</p>
        </Link>
        <Link href="/admin/reviews" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition">
          <p className="text-2xl mb-1">⭐</p><p className="font-semibold">Отзывы</p>
        </Link>
      </div>
    </div>
  )
}
