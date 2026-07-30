import { useCallback, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { studyDestinations } from '../../data/studyDestinations'
import type { StudyDestination } from '../../types/studyDestination'
import DestinationCard from './DestinationCard'
import DestinationDetailsModal from './DestinationDetailsModal'

interface Props {
  onRegister: (countryName: string) => void
}

export default function StudyDestinationsSection({ onRegister }: Props) {
  const [selected, setSelected] = useState<StudyDestination | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const reduceMotion = useReducedMotion()

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
    onRegister(destination.nameAr)
  }

  return (
    <section id="study-destinations" className="section study-destinations" dir="rtl">
      <motion.div
        className="container"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.08 }}
      >
        <div className="destination-section-heading">
          <span className="destination-section-badge"><MapPin aria-hidden="true" /> خمس وجهات تعليمية</span>
          <h2>وجهاتك الدراسية حول العالم</h2>
          <p>نساعدك على التسجيل في جامعات مختارة داخل خمس وجهات تعليمية مميزة، مع متابعة خطوات القبول والتسجيل من البداية حتى الوصول إلى الجامعة المناسبة.</p>
        </div>
        {studyDestinations.length ? (
          <div className="destination-grid">
            {studyDestinations.map((destination, index) => (
              <DestinationCard key={destination.id} destination={destination} index={index} onOpen={open} />
            ))}
          </div>
        ) : (
          <div className="empty-state">لا تتوفر الوجهات الدراسية حاليًا.</div>
        )}
      </motion.div>
      <DestinationDetailsModal destination={selected} onClose={close} onRegister={register} />
    </section>
  )
}
