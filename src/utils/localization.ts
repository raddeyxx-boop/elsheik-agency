import type { Language } from '../context/PreferencesContext'

const locale=(language:Language)=>language==='ar'?'ar-EG':'en-US'
export const formatDate=(value:string|Date,language:Language,options?:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat(locale(language),options??{dateStyle:'medium'}).format(new Date(value))
export const formatNumber=(value:number,language:Language,options?:Intl.NumberFormatOptions)=>new Intl.NumberFormat(locale(language),options).format(value)
