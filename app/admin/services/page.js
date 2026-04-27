'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [description, setDescription] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [editId, setEditId] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { loadServices() }, [])

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*').order('created_at')
    setServices(data || [])
  }

  const uploadPhoto = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
      .from('images')
      .upload(`services/${fileName}`, file)
    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`services/${fileName}`)
    return urlData.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      const payload = { name, price: Number(price), duration_minutes: Number(duration), description }
      if (photoFile) {
        payload.image_url = await uploadPhoto(photoFile)
      }
      if (editId) {
        await supabase.from('services').update(payload).eq('id', editId)
      } else {
        await supabase.from('services').insert(payload)
      }
      setName(''); setPrice(''); setDuration(''); setDescription(''); setPhotoFile(null); setEditId(null)
      loadServices()
    } catch (err) {
      alert('Ошибка загрузки фото: ' + err.message)
    }
    setUploading(false)
  }

  const handleEdit = (s) => {
    setName(s.name); setPrice(s.price); setDuration(s.duration_minutes)
    setDescription(s.description || ''); setEditId(s.id)
  }

  const handleDelete = async (id) => {
    await supabase.from('services').delete().eq('id', id)
    loadServices()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Управление услугами</h2>
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6 space-y-3">
        <h3 className="font-bold text-amber-500">{editId ? 'Редактировать' : 'Добавить'} услугу</h3>
        <input placeholder="Название" value={name} onChange={e => setName(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <div className="flex gap-2">
          <input type="number" placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)} required
            className="w-1/2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
          <input type="number" placeholder="Длит. (мин)" value={duration} onChange={e => setDuration(e.target.value)} required
            className="w-1/2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        </div>
        <input placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <div>
          <label className="block mb-1 text-sm text-zinc-400">Фото услуги</label>
          <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])}
            className="w-full text-sm text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded file:bg-amber-500 file:text-black file:border-0" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={uploading}
            className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 disabled:opacity-50">
            {uploading ? 'Загрузка...' : editId ? 'Обновить' : 'Добавить'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); setPrice(''); setDuration(''); setDescription(''); setPhotoFile(null) }}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600">Отмена</button>}
        </div>
      </form>

      <div className="space-y-2">
        {services.map(s => (
          <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {s.image_url && <img src={s.image_url} alt={s.name} className="w-10 h-10 rounded object-cover" />}
              <div>
                <span className="font-bold">{s.name}</span>
                <span className="text-zinc-400 ml-2">{s.price}₽ • {s.duration_minutes}мин</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="text-amber-500 hover:underline text-sm">Ред.</button>
              <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:underline text-sm">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
