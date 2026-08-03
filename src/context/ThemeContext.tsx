import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'
type ThemeContextValue={theme:Theme; toggleTheme:()=>void; setTheme:(theme:Theme)=>void}
const ThemeContext=createContext<ThemeContextValue|null>(null)
const storedTheme=()=>{const value=localStorage.getItem('elsheik-theme');return value==='light'||value==='dark'?value:null}
const systemTheme=():Theme=>window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'

export function ThemeProvider({children}:{children:ReactNode}){
  const [theme,setThemeState]=useState<Theme>(()=>storedTheme()??systemTheme())
  const setTheme=useCallback((value:Theme)=>{localStorage.setItem('elsheik-theme',value);setThemeState(value)},[])
  const toggleTheme=useCallback(()=>setTheme(theme==='light'?'dark':'light'),[setTheme,theme])
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.body.dataset.theme=theme},[theme])
  useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const update=()=>{if(!storedTheme())setThemeState(media.matches?'dark':'light')};media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
  const value=useMemo(()=>({theme,toggleTheme,setTheme}),[theme,toggleTheme,setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(){const value=useContext(ThemeContext);if(!value)throw new Error('useTheme must be used within ThemeProvider');return value}
