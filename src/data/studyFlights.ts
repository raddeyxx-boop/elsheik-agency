import type { StudyFlight } from '../types/studyFlight'

export const studyFlights: StudyFlight[] = [
  { id: 'india', nameKey:'destinations.india.name', flightLabelKey:'destinations.india.flightLabel', viewLabelKey:'destinations.india.viewLabel', duration: 9, delay: -2, accent: 'purple', badgePosition: 'top-right', path: 'M70 196 C166 72 316 74 448 194', depth: 'front' },
  { id: 'malaysia', nameKey:'destinations.malaysia.name', flightLabelKey:'destinations.malaysia.flightLabel', viewLabelKey:'destinations.malaysia.viewLabel', duration: 11, delay: -7, accent: 'green', badgePosition: 'middle-right', path: 'M72 274 C190 384 350 363 452 226', depth: 'front' },
  { id: 'china', nameKey:'destinations.china.name', flightLabelKey:'destinations.china.flightLabel', viewLabelKey:'destinations.china.viewLabel', duration: 13, delay: -4, accent: 'blue', badgePosition: 'bottom-right', path: 'M54 238 C168 132 341 130 468 232', depth: 'behind' },
  { id: 'russia', nameKey:'destinations.russia.name', flightLabelKey:'destinations.russia.flightLabel', viewLabelKey:'destinations.russia.viewLabel', duration: 15, delay: -11, accent: 'blue', badgePosition: 'top-left', path: 'M461 151 C342 38 178 40 60 172', depth: 'behind' },
  { id: 'turkey', nameKey:'destinations.turkey.name', flightLabelKey:'destinations.turkey.flightLabel', viewLabelKey:'destinations.turkey.viewLabel', duration: 7, delay: -5, accent: 'purple', badgePosition: 'middle-left', path: 'M467 301 C340 211 183 211 51 311', depth: 'front' },
  { id: 'bangalore', nameKey:'destinations.bangalore.name', flightLabelKey:'destinations.bangalore.flightLabel', viewLabelKey:'destinations.bangalore.viewLabel', duration: 13, delay: -9, accent: 'green', badgePosition: 'bottom-left', path: 'M378 62 C250 137 184 276 151 414', depth: 'behind' },
]
