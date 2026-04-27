'use client'
import { createContext, useContext, useState } from 'react'

const LightboxContext = createContext()

export function useLightbox() {
  return useContext(LightboxContext)
}

export default function LightboxProvider({ children }) {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' })

  const openLightbox = (src, alt) => setLightbox({ open: true, src, alt })
  const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' })

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  )
}
