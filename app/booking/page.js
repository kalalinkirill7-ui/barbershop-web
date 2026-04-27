'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format, addMinutes, isBefore, startOfDay } from 'date-fns'
import ReviewForm from '@/components/ReviewForm'

const STEPS = ['Услуга', 'Мастер', 'Дата и время', 'Контакты', 'Подтверждение']

function BookingContent() {
  const searchParams = useSearchParams()
  const initialServiceId = searchParams.get('service')

  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedBarber, setSelectedBarber] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*'),
      supabase.from('barbers').select('*')
    ]).then(([s, b]) => {
      setServices(s.data || [])
      setBarbers(b.data || [])
      if (initialServiceId) {
        const found = (s.data || []).find(svc => svc.id === initialServiceId)
        if (found) {
          setSelectedService(found)
          setStep(1)
        }
      }
    })
  }, [initialServiceId])

  useEffect(() => {
    if (step === 2 && selectedBarber && selectedDate && selectedService) loadSlots()
  }, [selectedDate, selectedBarber, selectedService, step])

  const loadSlots = async () => {
    setSlotsLoading(true)
    setAvailableSlots([])
    const date = new Date(selectedDate)
    const dayOfWeek = date.getDay()
    const { data: hoursData } = await supabase
      .from('working_hours')
      .select('*')
      .eq('barber_id', selectedBarber.id)
      .eq('day_of_week', dayOfWeek)
    if (!hoursData || hoursData.length === 0) { setSlotsLoading(false); return }

    const wh = hoursData[0]
    const startTime = new Date(`${selectedDate}T${wh.start_time}`)
    const endTime = new Date(`${selectedDate}T${wh.end_time}`)
    const slotDuration = selectedService.duration_minutes
    const slots = []
    let current = startTime
    while (isBefore(current, endTime)) {
      const slotEnd = addMinutes(current, slotDuration)
      if (slotEnd <= endTime) slots.push(current)
      current = addMinutes(current, 15)
    }

    const startOfDayDate = startOfDay(date)
    const endOfDayDate = new Date(startOfDayDate.getTime() + 24*60*60*1000)
    const { data: appointments } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('barber_id', selectedBarber.id)
      .gte('start_time', startOfDayDate.toISOString())
      .lt('start_time', endOfDayDate.toISOString())
      .neq('status', 'cancelled')

    const freeSlots = slots.filter(slot => {
      const slotEnd = addMinutes(slot, slotDuration)
      return !appointments?.some(app => {
        const appStart = new Date(app.start_time)
        const appEnd = new Date(app.end_time)
        return (slot < appEnd && slotEnd > appStart)
      })
    })
    setAvailableSlots(freeSlots)
    setSlotsLoading(false)
  }

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSubmitBooking = async () => {
    if (!clientName || !clientPhone || !selectedService || !selectedBarber || !selectedTime) return
    const end_time = addMinutes(selectedTime, selectedService.duration_minutes)
    const { error } = await supabase.from('appointments').insert({
      client_name: clientName,
      client_phone: clientPhone,
      service_id: selectedService.id,
      barber_id: selectedBarber.id,
      start_time: selectedTime.toISOString(),
      end_time: end_time.toISOString(),
      status: 'pending'
    })
    if (error) setBookingError('Ошибка записи: ' + error.message)
    else {
      // Отправляем уведомление в Telegram
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: clientName,
            client_phone: clientPhone,
            service: selectedService.name,
            barber: selectedBarber.name,
            date: format(selectedTime, 'dd.MM.yyyy в HH:mm')
          })
        })
      } catch (e) {}
      setStep(5)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Онлайн-запись</h1>
      {step !== 1 || !initialServiceId ? (
        <div className="flex justify-center mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center ${i <= step ? 'text-amber-500' : 'text-zinc-600'}`}>
              <span className="hidden md:inline">{s}</span>
              <span className="mx-2 text-xl">•</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-zinc-400 mb-4">
          Выбрана услуга: <strong className="text-amber-500">{selectedService?.name}</strong>. Выберите мастера.
        </div>
      )}
      {step === 0 && (
        <div className="grid gap-4">
          {services.map(service => (
            <div key={service.id}
              onClick={() => { setSelectedService(service); handleNext() }}
              className={`cursor-pointer border-2 rounded-lg p-4 bg-zinc-900 ${selectedService?.id === service.id ? 'border-amber-500' : 'border-zinc-800 hover:border-zinc-600'}`}>
              <h3 className="text-xl font-bold text-amber-500">{service.name}</h3>
              <p>{service.price} ₽ • {service.duration_minutes} мин</p>
            </div>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="grid gap-4">
          {barbers.map(barber => (
            <div key={barber.id}
              onClick={() => { setSelectedBarber(barber); handleNext() }}
              className={`cursor-pointer border-2 rounded-lg p-4 bg-zinc-900 ${selectedBarber?.id === barber.id ? 'border-amber-500' : 'border-zinc-800 hover:border-zinc-600'}`}>
              <h3 className="text-xl font-bold">{barber.name}</h3>
              <p className="text-zinc-400">{barber.position}</p>
            </div>
          ))}
          <button onClick={handleBack} className="text-amber-500 hover:underline mt-2">← Назад</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="mb-4">
            <label className="block mb-1">Дата</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
          </div>
          {slotsLoading ? <p>Загрузка...</p> : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot, idx) => (
                <button key={idx} onClick={() => { setSelectedTime(slot); handleNext() }}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded hover:border-amber-500">
                  {format(slot, 'HH:mm')}
                </button>
              ))}
              {availableSlots.length === 0 && selectedDate && <p className="text-zinc-500 col-span-full">Нет свободных слотов</p>}
            </div>
          )}
          <button onClick={handleBack} className="text-amber-500 hover:underline mt-4">← Назад</button>
        </div>
      )}
      {step === 3 && (
        <div className="max-w-md mx-auto space-y-4">
          <input placeholder="Ваше имя" value={clientName} onChange={e => setClientName(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
          <input placeholder="Телефон" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white" />
          <div className="flex gap-2">
            <button onClick={handleBack} className="text-amber-500 hover:underline">← Назад</button>
            <button onClick={handleSubmitBooking} disabled={!clientName || !clientPhone}
              className="px-6 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 disabled:opacity-50">
              Записаться
            </button>
          </div>
          {bookingError && <p className="text-red-500">{bookingError}</p>}
        </div>
      )}
      {step === 5 && (
        <div>
          <div className="text-center text-green-400 text-2xl font-bold mb-8">
            ✅ Запись создана! <br />
            <span className="text-base text-zinc-400">Ждём вас {selectedTime ? format(selectedTime, 'dd.MM.yyyy в HH:mm') : ''}</span>
          </div>
          
          {!reviewSubmitted && (
            <div className="max-w-md mx-auto mb-8">
              <h3 className="text-lg font-semibold text-center mb-4">Как вам сервис? Оставьте отзыв!</h3>
              <ReviewForm phone={clientPhone} onSuccess={() => setReviewSubmitted(true)} />
            </div>
          )}

          <div className="text-center mt-6">
            <button onClick={() => { setStep(0); setSelectedService(null); setSelectedBarber(null); setReviewSubmitted(false) }}
              className="px-6 py-2 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400">
              Новая запись
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-zinc-400">Загрузка...</div>}>
      <BookingContent />
    </Suspense>
  )
}
