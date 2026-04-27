'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/my-bookings')
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Вход</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
          Войти
        </button>
        <p className="text-sm text-zinc-400 text-center">
          Ещё нет аккаунта? <a href="/register" className="text-amber-500 hover:underline">Регистрация</a>
        </p>
      </form>
    </div>
  )
}
