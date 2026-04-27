'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const DAYS = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']

export default function AdminBarbers() {
  const [barbers, setBarbers] = useState([])
  const [name, setName] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [position, setPosition] = useState('')
  const [bio, setBio] = useState('')
  const [editId, setEditId] = useState(null)
  const [hours, setHours] = useState([])
  const [selectedBarber, setSelectedBarber] = useState(null)
  const [day, setDay] = useState('1')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('18:00')
  const [uploading, setUploading] = useState(false)

  useEffect(() => { loadBarbers() }, [])

  const loadBarbers = async () => {
    const { data } = await supabase.from('barbers').select('*').order('created_at')
    setBarbers(data || [])
  }

  const loadHours = async (barberId) => {
    const { data } = await supabase.from('working_hours').select('*').eq('barber_id', barberId)
    setHours(data || [])
  }

  const uploadPhoto = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`barbers/${fileName}`, file)
    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`barbers/${fileName}`)
    return urlData.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    let photoUrl = ''
    try {
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile)
      }
      const payload = { name, position, bio }
      if (photoUrl) payload.photo_url = photoUrl
      if (editId) {
        await supabase.from('barbers').update(payload).eq('id', editId)
      } else {
        await supabase.from('barbers').insert(payload)
      }
      setName(''); setPhotoFile(null); setPosition(''); setBio(''); setEditId(null)
      loadBarbers()
    } catch (err) {
      alert('Ошибка загрузки фото: ' + err.message)
    }
    setUploading(false)
  }

  const handleEdit = (b) => {
    setName(b.name); setPosition(b.position || ''); setBio(b.bio || '')
    setEditId(b.id); setSelectedBarber(b.id); loadHours(b.id)
  }

  const addHours = async () => {
    if (!selectedBarber) return
    await supabase.from('working_hours').insert({
      barber_id: selectedBarber,
      day_of_week: Number(day),
      start_time: start,
      end_time: end
    })
    loadHours(selectedBarber)
  }

  const deleteHours = async (id) => {
    await supabase.from('working_hours').delete().eq('id', id)
    if (selectedBarber) loadHours(selectedBarber)
  }

  const handleDelete = async (id) => {
    await supabase.from('barbers').delete().eq('id', id)
    loadBarbers()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Управление мастерами</h2>
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6 space-y-3">
        <h3 className="font-bold text-amber-500">{editId ? 'Редактировать' : 'Добавить'} мастера</h3>
        <input placeholder="Имя" value={name} onChange={e => setName(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <div>
          <label className="block mb-1 text-sm text-zinc-400">Фото</label>
          <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])}
            className="w-full text-sm text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded file:bg-amber-500 file:text-black file:border-0" />
        </div>
        <input placeholder="Должность" value={position} onChange={e => setPosition(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input placeholder="Био" value={bio} onChange={e => setBio(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <div className="flex gap-2">
          <button type="submit" disabled={uploading}
            className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 disabled:opacity-50">
            {uploading ? 'Загрузка...' : editId ? 'Обновить' : 'Добавить'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setPhotoFile(null); setPosition(''); setBio(''); setSelectedBarber(null); setHours([]) }}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600">Отмена</button>}
        </div>
      </form>

      <div className="space-y-2 mb-6">
        {barbers.map(b => (
          <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {b.photo_url ? (
                <img src={b.photo_url} alt={b.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">💈</div>
              )}
              <div>
                <span className="font-bold">{b.name}</span>
                <span className="text-zinc-400 ml-2">{b.position}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(b)} className="text-amber-500 hover:underline text-sm">Ред.</button>
              <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:underline text-sm">Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {selectedBarber && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-bold text-amber-500 mb-3">Рабочие часы: {barbers.find(b => b.id === selectedBarber)?.name}</h3>
          <div className="flex gap-2 mb-4 flex-wrap">
            <select value={day} onChange={e => setDay(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white">
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
            <input type="time" value={start} onChange={e => setStart(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
            <input type="time" value={end} onChange={e => setEnd(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
            <button onClick={addHours} className="px-3 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">Добавить</button>
          </div>
          <div className="space-y-1">
            {hours.map(h => (
              <div key={h.id} className="flex justify-between items-center text-sm">
                <span>{DAYS[h.day_of_week]} {h.start_time}-{h.end_time}</span>
                <button onClick={() => deleteHours(h.id)} className="text-red-400 hover:underline">Удалить</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
