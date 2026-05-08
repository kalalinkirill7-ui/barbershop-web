'use client'
import { useLightbox } from '@/components/LightboxProvider'

export default function BarberCard({ barber }) {
  const { openLightbox } = useLightbox()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {barber.photo_url ? (
          <button onClick={() => openLightbox(barber.photo_url, barber.name)} className="w-full h-full">
            <img src={barber.photo_url} alt={barber.name} className="w-full h-full object-cover" />
          </button>
        ) : (
          <span className="text-5xl">💈</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{barber.name}</h3>
        <p className="text-sm text-amber-600">{barber.position || 'Барбер'}</p>
        <p className="text-xs text-gray-400 mt-1">{barber.bio}</p>
      </div>
    </div>
  )
}
