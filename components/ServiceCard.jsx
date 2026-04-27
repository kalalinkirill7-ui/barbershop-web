'use client'
import Link from 'next/link'

export default function ServiceCard({ service }) {
  return (
    <Link
      href={`/booking?service=${service.id}`}
      className="block bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-amber-500 transition-all hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
    >
      <div className="h-40 bg-zinc-800 flex items-center justify-center">
        {service.image_url ? (
          <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl text-zinc-600">💇</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-amber-500 mb-1">{service.name}</h3>
        <p className="text-zinc-400 text-sm mb-3">{service.description || ''}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">{service.price} ₽</span>
          <span className="text-sm text-zinc-500">{service.duration_minutes} мин</span>
        </div>
      </div>
    </Link>
  )
}
