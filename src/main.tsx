import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './english-test.css'
import { PreferencesProvider } from './context/PreferencesContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(<StrictMode><ThemeProvider><PreferencesProvider><App /></PreferencesProvider></ThemeProvider></StrictMode>)
