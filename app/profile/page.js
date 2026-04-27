'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setName(user.user_metadata?.name || '')
      setPhone(user.user_metadata?.phone || '')
      setLoading(false)
    })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setStatus('')
    const { error } = await supabase.auth.updateUser({
      data: { name, phone }
    })
    if (error) setStatus('Ошибка: ' + error.message)
    else setStatus('Сохранено!')
  }

  if (loading) return <div className="text-center py-20">Загрузка...</div>

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Мой профиль</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
        <p className="text-zinc-400 text-sm mb-4">Email: <span className="text-white">{user?.email}</span></p>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-zinc-400">Имя</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm text-zinc-400">Телефон</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} required
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
          </div>
          <button type="submit" className="w-full py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
            Сохранить
          </button>
        </form>
        {status && <p className={status.includes('Ошибка') ? 'text-red-400' : 'text-green-400'}>{status}</p>}
      </div>
    </div>
  )
}
