'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  useEffect(() => { loadReviews() }, [])
  const loadReviews = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    setReviews(data || [])
  }
  const handleDelete = async (id) => {
    await supabase.from('reviews').delete().eq('id', id)
    loadReviews()
  }
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Управление отзывами</h2>
      <div className="space-y-2">
        {reviews.map(r => (
          <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
            <div>
              <span className="font-bold">{r.author_name}</span>
              <span className="text-amber-500 ml-2">{'★'.repeat(r.rating)}</span>
              <p className="text-sm text-zinc-400">{r.text}</p>
            </div>
            <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:underline text-sm">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  )
}
