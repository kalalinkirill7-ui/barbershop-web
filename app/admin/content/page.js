'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminContent() {
  const [heroTitle, setHeroTitle] = useState('')
  const [heroText, setHeroText] = useState('')

  useEffect(() => {
    supabase.from('content').select('*').then(({ data }) => {
      if (data) {
        setHeroTitle(data.find(d => d.key === 'hero_title')?.value || '')
        setHeroText(data.find(d => d.key === 'hero_text')?.value || '')
      }
    })
  }, [])

  const save = async () => {
    await supabase.from('content').upsert({ key: 'hero_title', value: heroTitle })
    await supabase.from('content').upsert({ key: 'hero_text', value: heroText })
    alert('Сохранено!')
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Редактирование контента</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4 max-w-xl">
        <div>
          <label className="block mb-1 text-sm text-zinc-400">Заголовок</label>
          <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        </div>
        <div>
          <label className="block mb-1 text-sm text-zinc-400">Подзаголовок</label>
          <input value={heroText} onChange={e => setHeroText(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        </div>
        <button onClick={save} className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
          Сохранить
        </button>
      </div>
    </div>
  )
}
