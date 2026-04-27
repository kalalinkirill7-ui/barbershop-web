'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ServiceCard from '@/components/ServiceCard'
import BarberCard from '@/components/BarberCard'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'
import GallerySection from '@/components/GallerySection'

export default function Home() {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [gallery, setGallery] = useState([])
  const [reviews, setReviews] = useState([])
  const [heroTitle, setHeroTitle] = useState('Брутальный стиль')
  const [heroText, setHeroText] = useState('Почувствуй уверенность с каждой стрижкой')

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
    })
  }, [])

  return (
    <div>
      <section className="py-20 text-center border-b border-zinc-800">
        <h1 className="text-6xl md:text-7xl font-black uppercase text-amber-500 mb-4">{heroTitle}</h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto px-4">{heroText}</p>
      </section>

      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Услуги и цены</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => <ServiceCard key={s.id} service={s} />)}
        </div>
      </section>

      <section className="py-16 container mx-auto px-4 border-t border-zinc-800">
        <h2 className="text-3xl font-bold mb-8 text-center">Наши мастера</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map(b => <BarberCard key={b.id} barber={b} />)}
        </div>
      </section>

      <GallerySection gallery={gallery} />

      <section className="py-16 container mx-auto px-4 border-t border-zinc-800">
        <h2 className="text-3xl font-bold mb-8 text-center">Отзывы</h2>
        <div className="max-w-2xl mx-auto mb-12">
          <ReviewForm />
        </div>
        <ReviewsList reviews={reviews} />
      </section>
    </div>
  )
}
