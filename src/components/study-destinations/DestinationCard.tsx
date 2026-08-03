import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import type { StudyDestination } from '../../types/studyDestination'
import { usePreferences } from '../../context/PreferencesContext'
import { destinationEnglish } from '../../i18n/content'

interface Props {
  destination: StudyDestination
  index: number
  onOpen: (destination: StudyDestination, trigger: HTMLButtonElement) => void
}

export default function DestinationCard({ destination, index, onOpen }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  const reduceMotion = useReducedMotion()
  const {language,t}=usePreferences()
  const english=destinationEnglish[destination.id]
  const name=language==='en'?(english?.name??destination.nameAr):destination.nameAr

  return (
    <motion.button
      type="button"
      className="destination-card"
      aria-label={t(`استكشف الدراسة في ${destination.nameAr}`,`Explore studying in ${name}`)}
      onClick={(event) => onOpen(destination, event.currentTarget)}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : index * 0.07 }}
    >
      <span className="destination-image-wrap">
        {!imageFailed ? (
          <img
            className="destination-image"
            src={destination.imageUrl}
            alt={language==='en'?(english?.alt??destination.imageAltAr):destination.imageAltAr}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="destination-image-fallback">
            <GraduationCap aria-hidden="true" />
            {t('تعذر تحميل صورة الوجهة.','The destination image could not be loaded.')}
          </span>
        )}
        <span className="destination-image-shade" />
        <span className="destination-country-name">{name}</span>
      </span>
      <span className="destination-card-body">
        <span className="destination-card-icon"><GraduationCap aria-hidden="true" /></span>
        <span className="destination-description">{language==='en'?(english?.description??destination.descriptionAr):destination.descriptionAr}</span>
        <span className="destination-action">{t('استكشف الدراسة','Explore Study Options')} <ArrowLeft aria-hidden="true" /></span>
      </span>
    </motion.button>
  )
}
