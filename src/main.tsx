import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './english-test.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
