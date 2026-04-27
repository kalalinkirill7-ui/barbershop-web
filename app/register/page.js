'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!name || !phone) {
      setError('Имя и телефон обязательны')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Регистрация успешна!')
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        setTimeout(() => router.push('/login'), 1500)
      } else {
        router.push('/my-bookings')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleRegister} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Регистрация</h2>
        <input type="text" placeholder="Ваше имя *" value={name} onChange={e => setName(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input type="password" placeholder="Пароль *" value={password} onChange={e => setPassword(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        <input type="tel" placeholder="Телефон * (для записей)" value={phone} onChange={e => setPhone(e.target.value)} required
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button type="submit" className="w-full py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
          Зарегистрироваться
        </button>
        <p className="text-sm text-zinc-400 text-center">
          Уже есть аккаунт? <a href="/login" className="text-amber-500 hover:underline">Войти</a>
        </p>
      </form>
    </div>
  )
}
