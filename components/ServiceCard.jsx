'use client'
import Link from 'next/link'

export default function ServiceCard({ service }) {
  return (
    <Link href={`/booking?service=${service.id}`}
      className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-300 transition-all">
      {service.image_url && (
        <img src={service.image_url} alt={service.name} className="w-full h-40 object-cover rounded-xl mb-4" />
      )}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{service.description || ''}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-amber-600">{service.price} ₽</span>
        <span className="text-xs text-gray-400">{service.duration_minutes} мин</span>
      </div>
    </Link>
  )
}
