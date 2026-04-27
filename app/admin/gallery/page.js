'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [barbers, setBarbers] = useState([])
  const [beforeUrl, setBeforeUrl] = useState('')
  const [afterUrl, setAfterUrl] = useState('')
  const [description, setDescription] = useState('')
  const [barberId, setBarberId] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    loadGallery()
    supabase.from('barbers').select('id, name').then(({ data }) => setBarbers(data || []))
  }, [])

  const loadGallery = async () => {
    const { data } = await supabase.from('gallery').select('*, barbers(name)').order('created_at', { ascending: false })
    setItems(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { before_url: beforeUrl, after_url: afterUrl, description, barber_id: barberId || null }
    if (editId) {
      await supabase.from('gallery').update(payload).eq('id', editId)
    } else {
      await supabase.from('gallery').insert(payload)
    }
    setBeforeUrl(''); setAfterUrl(''); setDescription(''); setBarberId(''); setEditId(null)
    loadGallery()
  }

  const handleEdit = (item) => {
    setBeforeUrl(item.before_url); setAfterUrl(item.after_url || ''); setDescription(item.description || '')
    setBarberId(item.barber_id || ''); setEditId(item.id)
  }

  const handleDelete = async (id) => {
    await supabase.from('gallery').delete().eq('id', id)
    loadGallery()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Галерея работ</h2>
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6 space-y-3">
        <h3 className="font-bold text-amber-500">{editId ? 'Редактировать' : 'Добавить'} работу</h3>
        <input placeholder="URL фото ДО" value={beforeUrl} onChange={e => setBeforeUrl(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input placeholder="URL фото ПОСЛЕ" value={afterUrl} onChange={e => setAfterUrl(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <select value={barberId} onChange={e => setBarberId(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white">
          <option value="">Выберите мастера (необязательно)</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
            {editId ? 'Обновить' : 'Добавить'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setBeforeUrl(''); setAfterUrl(''); setDescription(''); setBarberId('') }}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600">Отмена</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="flex h-40">
              <div className="w-1/2">
                <img src={item.before_url} alt="До" className="w-full h-full object-cover" />
              </div>
              <div className="w-1/2">
                {item.after_url ? (
                  <img src={item.after_url} alt="После" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-sm">Нет фото</div>
                )}
              </div>
            </div>
            <div className="p-3">
              {item.description && <p className="text-sm text-zinc-400 mb-1">{item.description}</p>}
              {item.barbers?.name && <p className="text-xs text-amber-500">Мастер: {item.barbers.name}</p>}
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(item)} className="text-amber-500 hover:underline text-sm">Ред.</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline text-sm">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
