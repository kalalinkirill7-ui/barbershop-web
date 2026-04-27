'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReviewForm({ phone = '', onSuccess }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setStatus('Поставьте оценку')
      return
    }
    const { error } = await supabase.from('reviews').insert({
      author_name: name,
      text,
      rating,
      client_phone: phone || null,
      verified: !!phone
    })
    if (error) setStatus('Ошибка: ' + error.message)
    else {
      setStatus('Спасибо за отзыв!')
      setName(''); setText(''); setRating(0)
      if (onSuccess) onSuccess()
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
        <div className="flex flex-row-reverse gap-1">
          {[5,4,3,2,1].map(n => (
            <button type="button" key={n} onClick={() => setRating(n)}
              className={`text-2xl transition-colors ${n <= rating ? 'text-amber-500' : 'text-zinc-600 hover:text-amber-400'}`}>
              ★
            </button>
          ))}
        </div>
        {rating > 0 && <span className="text-sm text-amber-500 ml-2">{rating}/5</span>}
      </div>
      <button type="submit" className="px-4 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
        Отправить
      </button>
      {status && <p className={status.includes('Ошибка') ? 'text-red-400' : 'text-green-400'}>{status}</p>}
    </form>
  )
}
