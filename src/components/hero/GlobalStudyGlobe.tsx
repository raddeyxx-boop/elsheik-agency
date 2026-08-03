import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { studyFlights } from '../../data/studyFlights'
import DestinationBadge from './DestinationBadge'
import FlightPath from './FlightPath'
import RealisticEarth from './RealisticEarth'
import { usePreferences } from '../../context/PreferencesContext'

export default function GlobalStudyGlobe() {
  const {t}=usePreferences()
  const [activeFlight, setActiveFlight] = useState<string | null>(null)
  const clearTimer = useRef<number | null>(null)
  const reducedMotion = Boolean(useReducedMotion())

  const activate = (id: string) => {
    if (clearTimer.current) window.clearTimeout(clearTimer.current)
    setActiveFlight(id)
  }

  const activateTemporarily = (id: string) => {
    activate(id)
    clearTimer.current = window.setTimeout(() => setActiveFlight(null), 2600)
  }

  const deactivate = () => {
    if (clearTimer.current) window.clearTimeout(clearTimer.current)
    setActiveFlight(null)
  }

  useEffect(() => () => {
    if (clearTimer.current) window.clearTimeout(clearTimer.current)
  }, [])

  return (
    <div className={`global-study-globe${activeFlight ? ' has-active-flight' : ''}`} aria-label={t('destinations.globalTitle')}>
      <div className="globe-atmosphere" aria-hidden="true" />
      <div className="real-flight-layer behind">
        {studyFlights.filter((flight) => flight.depth === 'behind').map((flight) => <FlightPath key={flight.id} flight={flight} active={activeFlight === flight.id} reducedMotion={reducedMotion} />)}
      </div>
      <RealisticEarth />
      <div className="real-flight-layer front">
        {studyFlights.filter((flight) => flight.depth === 'front').map((flight) => <FlightPath key={flight.id} flight={flight} active={activeFlight === flight.id} reducedMotion={reducedMotion} />)}
      </div>
      <div className="globe-badges">
        {studyFlights.map((flight) => (
          <DestinationBadge key={flight.id} flight={flight} active={activeFlight === flight.id} onActivate={activate} onTap={activateTemporarily} onDeactivate={deactivate} />
        ))}
      </div>
    </div>
  )
}
