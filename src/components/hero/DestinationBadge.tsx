import { MapPin, Plane } from 'lucide-react'
import type { StudyFlight } from '../../types/studyFlight'

interface Props {
  flight: StudyFlight
  active: boolean
  onActivate: (id: string) => void
  onTap: (id: string) => void
  onDeactivate: () => void
}

export default function DestinationBadge({ flight, active, onActivate, onTap, onDeactivate }: Props) {
  return (
    <button
      type="button"
      className={`globe-destination-badge ${flight.badgePosition} accent-${flight.accent}${active ? ' active' : ''}`}
      aria-label={`عرض معلومات الدراسة في ${flight.destinationAr}`}
      aria-pressed={active}
      onMouseEnter={() => onActivate(flight.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(flight.id)}
      onBlur={onDeactivate}
      onClick={() => onTap(flight.id)}
    >
      <Plane aria-hidden="true" />
      <span>{flight.labelAr}</span>
      <span className="globe-destination-tooltip"><MapPin aria-hidden="true" /> وجهة تعليمية متاحة للتسجيل</span>
    </button>
  )
}
