'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ServiceCard from '@/components/ServiceCard'
import BarberCard from '@/components/BarberCard'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'
import GallerySection from '@/components/GallerySection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [gallery, setGallery] = useState([])
  const [reviews, setReviews] = useState([])
  const [heroTitle, setHeroTitle] = useState('Добро пожаловать')
  const [heroText, setHeroText] = useState('')
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*'),
      supabase.from('barbers').select('*'),
      supabase.from('gallery').select('*, barbers(name)').order('created_at', { ascending: false }).limit(6),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('content').select('*')
    ]).then(([s, b, g, r, c]) => {
      setServices(s.data || [])
      setBarbers(b.data || [])
      setGallery(g.data || [])
      setReviews(r.data || [])
      const title = c.data?.find(i => i.key === 'hero_title')?.value
      const text = c.data?.find(i => i.key === 'hero_text')?.value
      if (title) setHeroTitle(title)
      if (text) setHeroText(text)
      setContacts(c.data?.filter(i => ['phone', 'address', 'telegram', 'whatsapp', 'map_link'].includes(i.key)) || [])
    })
  }, [])

  return (
    <div className="min-h-screen">
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-4 tracking-tight">{heroTitle}</h1>
        {heroText && <p className="text-xl text-gray-500 max-w-2xl mx-auto px-4">{heroText}</p>}
      </section>

      <section className="py-16 max-w-6xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Услуги и цены</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-5 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Наши мастера</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map(b => <BarberCard key={b.id} barber={b} />)}
        </div>
      </section>

      <GallerySection gallery={gallery} />

      <section className="py-16 max-w-3xl mx-auto px-5">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Отзывы</h2>
        <div className="mb-12">
          <ReviewForm />
        </div>
        <ReviewsList reviews={reviews} />
      </section>

      <ContactSection contacts={contacts} />
    </div>
  )
}
