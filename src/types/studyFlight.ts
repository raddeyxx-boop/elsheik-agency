export interface StudyFlight {
  id: string
  nameKey: string
  flightLabelKey: string
  viewLabelKey: string
  duration: number
  delay: number
  accent: 'purple' | 'blue' | 'green'
  badgePosition: string
  path: string
  depth: 'front' | 'behind'
}
