export default function BarberCard({ barber }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="aspect-square bg-zinc-800 flex items-center justify-center">
        {barber.photo_url ? (
          <a href={barber.photo_url} target="_blank" rel="noreferrer" className="w-full h-full flex items-center justify-center">
            <img src={barber.photo_url} alt={barber.name} className="max-w-full max-h-full object-contain" />
          </a>
        ) : (
          <span className="text-4xl text-zinc-600">💈</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{barber.name}</h3>
        <p className="text-amber-500 text-sm mb-2">{barber.position || 'Барбер'}</p>
        <p className="text-sm text-zinc-400">{barber.bio}</p>
      </div>
    </div>
  )
}
