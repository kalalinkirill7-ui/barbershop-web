export default function ReviewsList({ reviews }) {
  if (!reviews || reviews.length === 0) return <p className="text-center text-zinc-500">Пока нет отзывов.</p>

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {reviews.map(r => (
        <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold">{r.author_name}</span>
            <span className="text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
          </div>
          <p className="text-zinc-300">{r.text}</p>
        </div>
      ))}
    </div>
  )
}
