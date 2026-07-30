import type { CSSProperties } from 'react'
import type { StudyFlight } from '../../types/studyFlight'
import AnimatedAirplane from './AnimatedAirplane'

interface Props {
  flight: StudyFlight
  active: boolean
  reducedMotion: boolean
}

export default function FlightPath({ flight, active, reducedMotion }: Props) {
  const style = {
    '--route-duration': `${flight.duration}s`,
    '--route-delay': `${flight.delay}s`,
    '--flight-path': `path("${flight.path}")`,
  } as CSSProperties

  return (
    <div
      className={`real-flight-route route-${flight.id} depth-${flight.depth} accent-${flight.accent}${active ? ' active' : ''}${reducedMotion ? ' reduced' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 520 470" preserveAspectRatio="none">
        <path d={flight.path} pathLength="1" />
      </svg>
      {!reducedMotion && flight.id !== 'bangalore' && <AnimatedAirplane className="route-airplane" />}
    </div>
  )
}
