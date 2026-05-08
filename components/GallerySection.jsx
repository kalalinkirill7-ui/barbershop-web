export default function GallerySection({ gallery }) {
  if (!gallery || gallery.length === 0) return null

  return (
    <section className="py-16 max-w-6xl mx-auto px-5">
      <h2 className="text-3xl font-bold mb-8 text-center text-stone-800">Наши работы</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="grid grid-cols-2 aspect-[2/1]">
              <div className="relative bg-stone-100">
                <img src={item.before_url} alt="До" className="w-full h-full object-contain" />
                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">До</span>
              </div>
              <div className="relative bg-stone-100">
                {item.after_url ? (
                  <>
                    <img src={item.after_url} alt="После" className="w-full h-full object-contain" />
                    <span className="absolute bottom-1 right-1 bg-amber-500 text-black text-xs px-1 rounded font-semibold">После</span>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">После</div>
                )}
              </div>
            </div>
            <div className="p-4">
              {item.description && <p className="text-sm text-stone-600">{item.description}</p>}
              {item.barbers?.name && <p className="text-xs text-amber-600 mt-1">Мастер: {item.barbers.name}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
