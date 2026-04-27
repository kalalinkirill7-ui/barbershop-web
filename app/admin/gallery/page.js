'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [barbers, setBarbers] = useState([])
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [description, setDescription] = useState('')
  const [barberId, setBarberId] = useState('')
  const [editId, setEditId] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadGallery()
    supabase.from('barbers').select('id, name').then(({ data }) => setBarbers(data || []))
  }, [])

  const loadGallery = async () => {
    const { data } = await supabase.from('gallery').select('*, barbers(name)').order('created_at', { ascending: false })
    setItems(data || [])
  }

  const uploadPhoto = async (file, folder) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
      .from('images')
      .upload(`${folder}/${fileName}`, file)
    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`${folder}/${fileName}`)
    return urlData.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      let beforeUrl = ''
      let afterUrl = ''
      if (beforeFile) beforeUrl = await uploadPhoto(beforeFile, 'gallery')
      if (afterFile) afterUrl = await uploadPhoto(afterFile, 'gallery')
      const payload = { description, barber_id: barberId || null }
      if (beforeUrl) payload.before_url = beforeUrl
      if (afterUrl) payload.after_url = afterUrl
      if (editId) {
        await supabase.from('gallery').update(payload).eq('id', editId)
      } else {
        if (!beforeUrl) throw new Error('Нужно фото "До"')
        await supabase.from('gallery').insert(payload)
      }
      setBeforeFile(null); setAfterFile(null); setDescription(''); setBarberId(''); setEditId(null)
      loadGallery()
    } catch (err) {
      alert('Ошибка: ' + err.message)
    }
    setUploading(false)
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
        <div>
          <label className="block mb-1 text-sm text-zinc-400">Фото ДО</label>
          <input type="file" accept="image/*" onChange={e => setBeforeFile(e.target.files[0])}
            className="w-full text-sm text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded file:bg-amber-500 file:text-black file:border-0" />
        </div>
        <div>
          <label className="block mb-1 text-sm text-zinc-400">Фото ПОСЛЕ</label>
          <input type="file" accept="image/*" onChange={e => setAfterFile(e.target.files[0])}
            className="w-full text-sm text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded file:bg-amber-500 file:text-black file:border-0" />
        </div>
        <input placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <select value={barberId} onChange={e => setBarberId(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white">
          <option value="">Выберите мастера (необязательно)</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="submit" disabled={uploading}
            className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 disabled:opacity-50">
            {uploading ? 'Загрузка...' : editId ? 'Обновить' : 'Добавить'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setBeforeFile(null); setAfterFile(null); setDescription(''); setBarberId('') }}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600">Отмена</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="flex h-40">
              <div className="w-1/2">
                {item.before_url && <img src={item.before_url} alt="До" className="w-full h-full object-cover" />}
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
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:underline text-sm">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
