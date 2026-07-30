export interface StudyFlight {
  id: string
  labelAr: string
  destinationAr: string
  duration: number
  delay: number
  accent: 'purple' | 'blue' | 'green'
  badgePosition: string
  path: string
  depth: 'front' | 'behind'
}
