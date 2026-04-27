'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReviewForm() {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('reviews').insert({
      author_name: name,
      text,
      rating
    })
    if (error) setStatus('Ошибка: ' + error.message)
    else {
      setStatus('Спасибо за отзыв!')
      setName(''); setText(''); setRating(5)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <h3 className="font-bold text-amber-500">Оставить отзыв</h3>
      <input placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} required
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
      <textarea placeholder="Ваш отзыв" value={text} onChange={e => setText(e.target.value)} required rows={3}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Оценка:</span>
        {[5,4,3,2,1].map(n => (
          <button type="button" key={n} onClick={() => setRating(n)}
            className={`text-xl ${n <= rating ? 'text-amber-500' : 'text-zinc-600'}`}>
            ★
          </button>
        ))}
      </div>
      <button type="submit" className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
        Отправить
      </button>
      {status && <p className={status.includes('Ошибка') ? 'text-red-400' : 'text-green-400'}>{status}</p>}
    </form>
  )
}
