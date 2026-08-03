import { MapPin, Plane } from 'lucide-react'
import type { StudyFlight } from '../../types/studyFlight'
import { usePreferences } from '../../context/PreferencesContext'

interface Props {
  flight: StudyFlight
  active: boolean
  onActivate: (id: string) => void
  onTap: (id: string) => void
  onDeactivate: () => void
}

export default function DestinationBadge({ flight, active, onActivate, onTap, onDeactivate }: Props) {
  const {t}=usePreferences()
  return (
    <button
      type="button"
      className={`globe-destination-badge ${flight.badgePosition} accent-${flight.accent}${active ? ' active' : ''}`}
      aria-label={t(flight.viewLabelKey)}
      aria-pressed={active}
      onMouseEnter={() => onActivate(flight.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(flight.id)}
      onBlur={onDeactivate}
      onClick={() => onTap(flight.id)}
    >
      <Plane aria-hidden="true" />
      <span>{t(flight.flightLabelKey)}</span>
      <span className="globe-destination-tooltip"><MapPin aria-hidden="true" /> {t('destinations.available')}</span>
    </button>
  )
}
