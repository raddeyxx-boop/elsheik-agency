import { MessageCircle } from 'lucide-react'
import { usePreferences } from '../context/PreferencesContext'
import { resources } from '../i18n/resources'
export default function WhatsAppButton() {
  const {language}=usePreferences(); const copy=resources[language].whatsapp
  return <a className="whatsapp" href={`https://wa.me/919036102240?text=${encodeURIComponent(copy.message)}`} target="_blank" rel="noreferrer" aria-label={copy.button}><MessageCircle /><span>{copy.button}</span></a>
}
