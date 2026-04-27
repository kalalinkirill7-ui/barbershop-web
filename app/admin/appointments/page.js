'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [barbers, setBarbers] = useState([])
  const [date, setDate] = useState('')
  const [barberId, setBarberId] = useState('all')

  useEffect(() => {
    supabase.from('barbers').select('id, name').then(({ data }) => setBarbers(data || []))
  }, [])

  useEffect(() => { load() }, [date, barberId])

  const load = async () => {
    let query = supabase.from('appointments').select('*, services(name), barbers(name)').order('start_time')
    if (date) query = query.gte('start_time', `${date}T00:00:00`).lt('start_time', `${date}T23:59:59`)
    if (barberId !== 'all') query = query.eq('barber_id', barberId)
    const { data } = await query
    setAppointments(data || [])
  }

  const updateStatus = async (id, status) => {
    await supabase.from('appointments').update({ status }).eq('id', id)
    load()
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const statusColor = {
    pending: 'text-yellow-400',
    confirmed: 'text-green-400',
    cancelled: 'text-red-400',
    completed: 'text-blue-400'
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Управление записями</h2>
      <div className="flex gap-4 mb-6">
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <select value={barberId} onChange={e => setBarberId(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white">
          <option value="all">Все мастера</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {appointments.map(a => (
          <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="space-y-1">
                <p><span className="font-bold text-lg">{a.client_name}</span></p>
                <p className="text-zinc-400">📞 <span className="text-white">{a.client_phone}</span></p>
                <p className="text-zinc-400">💇 {a.services?.name}</p>
                <p className="text-zinc-400">💈 {a.barbers?.name}</p>
                <p className="text-zinc-400">📅 {formatDate(a.start_time)}</p>
                <p className={`font-semibold ${statusColor[a.status]}`}>
                  Статус: {a.status === 'pending' ? 'Ожидает' : a.status === 'confirmed' ? 'Подтверждена' : a.status === 'cancelled' ? 'Отменена' : 'Выполнена'}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => updateStatus(a.id, 'confirmed')} disabled={a.status === 'confirmed'}
                  className="px-3 py-1 bg-green-900 text-green-400 rounded text-sm hover:bg-green-800 disabled:opacity-30">Подтв.</button>
                <button onClick={() => updateStatus(a.id, 'completed')} disabled={a.status === 'completed'}
                  className="px-3 py-1 bg-blue-900 text-blue-400 rounded text-sm hover:bg-blue-800 disabled:opacity-30">Вып.</button>
                <button onClick={() => updateStatus(a.id, 'cancelled')} disabled={a.status === 'cancelled'}
                  className="px-3 py-1 bg-red-900 text-red-400 rounded text-sm hover:bg-red-800 disabled:opacity-30">Отм.</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
