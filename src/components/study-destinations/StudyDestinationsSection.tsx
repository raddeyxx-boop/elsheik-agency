import { useCallback, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { studyDestinations } from '../../data/studyDestinations'
import type { StudyDestination } from '../../types/studyDestination'
import DestinationCard from './DestinationCard'
import DestinationDetailsModal from './DestinationDetailsModal'
import { usePreferences } from '../../context/PreferencesContext'
import { destinationEnglish } from '../../i18n/content'

interface Props {
  onRegister: (countryName: string) => void
}

export default function StudyDestinationsSection({ onRegister }: Props) {
  const [selected, setSelected] = useState<StudyDestination | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const reduceMotion = useReducedMotion()
  const {language,t}=usePreferences()

  const open = (destination: StudyDestination, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setSelected(destination)
  }

  const close = useCallback(() => {
    setSelected(null)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }, [])

  const register = (destination: StudyDestination) => {
    setSelected(null)
    onRegister(language==='en'?destinationEnglish[destination.id]?.name??destination.nameAr:destination.nameAr)
  }

  return (
    <section id="study-destinations" className="section study-destinations">
      <motion.div
        className="container"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.08 }}
      >
        <div className="destination-section-heading">
          <span className="destination-section-badge"><MapPin aria-hidden="true" /> {t('خمس وجهات تعليمية','Five Education Destinations')}</span>
          <h2>{t('وجهاتك الدراسية حول العالم','Study Destinations Around the World')}</h2>
          <p>{t('نساعدك على التسجيل في جامعات مختارة داخل خمس وجهات تعليمية مميزة، مع متابعة خطوات القبول والتسجيل من البداية حتى الوصول إلى الجامعة المناسبة.','We help you apply to selected universities in five outstanding destinations and guide you from admission through enrollment.')}</p>
        </div>
        {studyDestinations.length ? (
          <div className="destination-grid">
            {studyDestinations.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} onOpen={open} />
            ))}
          </div>
        ) : (
          <div className="empty-state">{t('لا تتوفر الوجهات الدراسية حاليًا.','No study destinations are currently available.')}</div>
        )}
      </motion.div>
      <DestinationDetailsModal destination={selected} onClose={close} onRegister={register} />
    </section>
  )
}
