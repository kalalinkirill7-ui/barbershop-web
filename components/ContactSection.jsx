'use client'

export default function ContactSection({ contacts }) {
  const phone = contacts?.find(c => c.key === 'phone')?.value || ''
  const address = contacts?.find(c => c.key === 'address')?.value || ''
  const telegram = contacts?.find(c => c.key === 'telegram')?.value || ''
  const whatsapp = contacts?.find(c => c.key === 'whatsapp')?.value || ''
  const mapLink = contacts?.find(c => c.key === 'map_link')?.value || ''

  if (!phone && !address) return null

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Контакты</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          {phone && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-zinc-400 text-sm">Телефон</p>
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-xl font-bold text-white hover:text-amber-400">
                  {phone}
                </a>
              </div>
            </div>
          )}
          
          {address && (
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-zinc-400 text-sm">Адрес</p>
                <p className="text-white">{address}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {telegram && (
              <a href={telegram} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition text-sm">
                ✈️ Telegram
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition text-sm">
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-4 text-white">Быстрая запись</h3>
          <p className="text-sm text-zinc-400 mb-4">Наведите камеру на QR-код</p>
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://barbershop-web-brown.vercel.app/booking`}
              alt="QR-код на запись"
              className="w-48 h-48"
            />
          </div>
        </div>
      </div>

      {mapLink && (
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <iframe 
              src={mapLink}
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  )
}
