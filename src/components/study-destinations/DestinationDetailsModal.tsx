import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, GraduationCap, MessageCircle, X } from 'lucide-react'
import type { StudyDestination } from '../../types/studyDestination'
import { usePreferences } from '../../context/PreferencesContext'
import { destinationEnglish, destinationWhatsapp } from '../../i18n/content'

interface Props {
  destination: StudyDestination | null
  onClose: () => void
  onRegister: (destination: StudyDestination) => void
}

const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function DestinationDetailsModal({ destination, onClose, onRegister }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const reduceMotion = useReducedMotion()
  const {language,t}=usePreferences()
  const english=destination?destinationEnglish[destination.id]:undefined
  const name=destination?(language==='en'?(english?.name??destination.nameAr):destination.nameAr):''

  useEffect(() => setImageFailed(false), [destination?.id])

  useEffect(() => {
    if (!destination) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [destination, onClose])

  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          className="destination-modal-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            className="destination-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="destination-modal-title"
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
          >
            <button ref={closeButtonRef} type="button" className="destination-modal-close" onClick={onClose} aria-label={t('إغلاق تفاصيل الوجهة','Close destination details')}>
              <X aria-hidden="true" />
            </button>
            <div className="destination-modal-media">
              {!imageFailed ? (
                <img src={destination.imageUrl} alt={language==='en'?(english?.alt??destination.imageAltAr):destination.imageAltAr} onError={() => setImageFailed(true)} />
              ) : (
                <div className="destination-image-fallback"><GraduationCap aria-hidden="true" />{t('تعذر تحميل صورة الوجهة.','The destination image could not be loaded.')}</div>
              )}
            </div>
            <div className="destination-modal-content">
              <span className="destination-modal-badge"><GraduationCap aria-hidden="true" /> {t('وجهة تعليمية','Education Destination')}</span>
              <h2 id="destination-modal-title">{t(`الدراسة في ${destination.nameAr}`,`Study in ${name}`)}</h2>
              <p>{language==='en'?(english?.description??destination.descriptionAr):destination.descriptionAr}</p>
              <ul>
                {(language==='en'?(english?.highlights??destination.highlightsAr):destination.highlightsAr).map((highlight) => <li key={highlight}><CheckCircle2 aria-hidden="true" />{highlight}</li>)}
              </ul>
              <div className="destination-modal-actions">
                <button type="button" className="btn primary" onClick={() => onRegister(destination)}>{t('ابدأ طلب التسجيل','Start Your Application')}</button>
                <a
                  className="btn secondary"
                  href={`https://wa.me/919036102240?text=${encodeURIComponent(destinationWhatsapp(language,name))}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle aria-hidden="true" /> {t('استفسر عبر واتساب','Ask on WhatsApp')}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
