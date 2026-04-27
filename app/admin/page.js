'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [todayCount, setTodayCount] = useState(0)
  const [weekCount, setWeekCount] = useState(0)
  const [newCount, setNewCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/admin/login')
    })

    loadStats()
  }, [])

  const loadStats = async () => {
    const today = new Date().toISOString().slice(0, 10)
    
    const { count: todayC } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', `${today}T00:00:00`)
      .lt('start_time', `${today}T23:59:59`)
    
    const { count: weekC } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('start_time', new Date(Date.now() - 7*24*60*60*1000).toISOString())

    const { count: newC } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    setTodayCount(todayC || 0)
    setWeekCount(weekC || 0)
    setNewCount(newC || 0)
  }

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
        <Link href="/admin/appointments" className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition relative">
          <p className="text-2xl mb-1">📅</p><p className="font-semibold">Записи</p>
          {newCount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {newCount}
            </span>
          )}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-400">Новых записей</p>
          <p className="text-3xl font-bold text-red-400">{newCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-400">Сегодня</p>
          <p className="text-3xl font-bold">{todayCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-sm text-zinc-400">За неделю</p>
          <p className="text-3xl font-bold">{weekCount}</p>
        </div>
      </div>

      <button onClick={loadStats} className="text-sm text-amber-500 hover:underline">
        🔄 Обновить статистику
      </button>
    </div>
  )
}
