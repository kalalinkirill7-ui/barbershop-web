'use client'
import { useLightbox } from '@/components/LightboxProvider'

export default function GallerySection({ gallery }) {
  const { openLightbox } = useLightbox()

  if (!gallery || gallery.length === 0) return null

  return (
    <section className="py-16 container mx-auto px-4 border-t border-zinc-800">
      <h2 className="text-3xl font-bold mb-8 text-center">Наши работы</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 aspect-[2/1]">
              <button
                onClick={() => openLightbox(item.before_url, 'До')}
                className="relative block h-full bg-zinc-800"
              >
                <img src={item.before_url} alt="До" className="w-full h-full object-contain" />
                <span className="absolute bottom-1 left-1 bg-black/70 text-xs px-1 rounded">До</span>
              </button>
              <div className="relative h-full bg-zinc-800">
                {item.after_url ? (
                  <button
                    onClick={() => openLightbox(item.after_url, 'После')}
                    className="block h-full w-full"
                  >
                    <img src={item.after_url} alt="После" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-xs px-1 rounded">После</span>
                  </button>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">После</div>
                )}
              </div>
            </div>
            <div className="p-3">
              {item.description && <p className="text-sm text-zinc-300">{item.description}</p>}
              {item.barbers?.name && <p className="text-xs text-amber-500 mt-1">Мастер: {item.barbers.name}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
