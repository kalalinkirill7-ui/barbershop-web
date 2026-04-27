'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function MyBookings() {
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [searchDone, setSearchDone] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        const savedPhone = user.user_metadata?.phone
        if (savedPhone) {
          setPhone(savedPhone)
          // автоматически запустить поиск после подстановки номера
          searchBookings(savedPhone)
        }
      }
    })
  }, [])

  const searchBookings = async (phoneNumber) => {
    const phoneToSearch = phoneNumber || phone
    if (!phoneToSearch) return
    setLoading(true)
    setSearchDone(false)
    const { data } = await supabase
      .from('appointments')
      .select('*, services(name), barbers(name)')
      .eq('client_phone', phoneToSearch)
      .order('start_time')
    setBookings(data || [])
    setLoading(false)
    setSearchDone(true)
  }

  const cancel = async (id) => {
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    searchBookings(phone)
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Мои записи</h1>
      {user && <p className="text-center text-sm text-zinc-400 mb-4">Вы вошли как {user.email}</p>}
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Ваш телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
        />
        <button
          onClick={() => searchBookings()}
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 disabled:opacity-50"
        >
          Найти
        </button>
      </div>
      {searchDone && bookings.length === 0 && (
        <p className="text-center text-zinc-500">Нет записей с таким номером.</p>
      )}
      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-bold">{b.services?.name}</p>
              <p className="text-sm text-zinc-400">
                {b.barbers?.name} • {format(new Date(b.start_time), 'dd MMMM yyyy, HH:mm', { locale: ru })}
              </p>
              <p
                className={`text-sm mt-1 ${
                  b.status === 'confirmed' ? 'text-green-400' : b.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                }`}
              >
                {b.status === 'pending' ? 'Ожидает' : b.status === 'confirmed' ? 'Подтверждена' : 'Отменена'}
              </p>
            </div>
            {b.status !== 'cancelled' && (
              <button onClick={() => cancel(b.id)} className="text-red-400 text-sm hover:underline">
                Отменить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
