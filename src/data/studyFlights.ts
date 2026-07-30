import type { StudyFlight } from '../types/studyFlight'

export const studyFlights: StudyFlight[] = [
  { id: 'india', labelAr: 'إلى الهند', destinationAr: 'الهند', duration: 9, delay: -2, accent: 'purple', badgePosition: 'top-right', path: 'M70 196 C166 72 316 74 448 194', depth: 'front' },
  { id: 'malaysia', labelAr: 'إلى ماليزيا', destinationAr: 'ماليزيا', duration: 11, delay: -7, accent: 'green', badgePosition: 'middle-right', path: 'M72 274 C190 384 350 363 452 226', depth: 'front' },
  { id: 'china', labelAr: 'إلى الصين', destinationAr: 'الصين', duration: 13, delay: -4, accent: 'blue', badgePosition: 'bottom-right', path: 'M54 238 C168 132 341 130 468 232', depth: 'behind' },
  { id: 'russia', labelAr: 'إلى روسيا', destinationAr: 'روسيا', duration: 15, delay: -11, accent: 'blue', badgePosition: 'top-left', path: 'M461 151 C342 38 178 40 60 172', depth: 'behind' },
  { id: 'turkey', labelAr: 'إلى تركيا', destinationAr: 'تركيا', duration: 7, delay: -5, accent: 'purple', badgePosition: 'middle-left', path: 'M467 301 C340 211 183 211 51 311', depth: 'front' },
  { id: 'bangalore', labelAr: 'إلى بنغالور', destinationAr: 'بنغالور', duration: 13, delay: -9, accent: 'green', badgePosition: 'bottom-left', path: 'M378 62 C250 137 184 276 151 414', depth: 'behind' },
]
